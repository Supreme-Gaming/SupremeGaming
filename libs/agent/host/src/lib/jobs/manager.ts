import { Job, Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { Worker } from 'worker_threads';

import {
  AGENT_GAME_TYPES,
  AGENT_JOB_TYPES,
  type AgentCommandProgress,
  type AgentGameServerConfig,
  type AgentHostConfiguration,
  type CollectGameDataJobResult,
} from '@supremegaming/agent/core';

import { AgentCommandError } from '../commands/errors';
import { runArkParse } from './collect-game-data/ark';
import {
  COLLECT_GAME_DATA_JOB,
  collectGameDataSchedulerId,
  CollectGameDataJobData,
  DEFAULT_GAME_DATA_INTERVAL_MS,
} from './queue';
import { uploadGameDataSnapshot } from './upload';

export interface JobManagerOptions {
  queue: Queue<CollectGameDataJobData>;
  apiUrl: string;
  getAccessToken: () => string;
  intervalMs?: number;
}

const COLLECT_GAME_DATA_GAMES = new Set<string>([
  AGENT_GAME_TYPES.ARK_ASCENDED,
  AGENT_GAME_TYPES.ARK_EVOLVED,
]);
export function isCollectGameDataEligible(server: AgentGameServerConfig): boolean {
  return (
    COLLECT_GAME_DATA_GAMES.has(server.game) &&
    server.shouldProcess === true &&
    typeof server.server_directory === 'string' &&
    server.server_directory.length > 0
  );
}

export class JobManager {
  private configuration: AgentHostConfiguration | null = null;
  private readonly activeParses = new Map<string, Set<Worker>>();
  private readonly inFlight = new Map<
    string,
    { resolve: (result: CollectGameDataJobResult) => void; reject: (err: unknown) => void }
  >();
  private emitCommandProgress?: (progress: AgentCommandProgress) => void;
  private readonly intervalMs: number;

  constructor(private readonly options: JobManagerOptions) {
    this.intervalMs = options.intervalMs && options.intervalMs > 0 ? options.intervalMs : DEFAULT_GAME_DATA_INTERVAL_MS;
  }

  public setProgressEmitter(emit: (progress: AgentCommandProgress) => void): void {
    this.emitCommandProgress = emit;
  }

  public async applyConfiguration(configuration: AgentHostConfiguration): Promise<void> {
    this.configuration = configuration;

    const eligible = configuration.servers.filter(isCollectGameDataEligible);
    const eligibleSchedulerIds = new Set(eligible.map((server) => collectGameDataSchedulerId(String(server._id))));
    const existing = await this.options.queue.getJobSchedulers();

    for (const scheduler of existing) {
      const schedulerId = scheduler.key;

      if (!schedulerId?.startsWith(`${COLLECT_GAME_DATA_JOB}:`)) {
        continue;
      }

      if (!eligibleSchedulerIds.has(schedulerId)) {
        await this.options.queue.removeJobScheduler(schedulerId);
      }
    }

    for (const server of eligible) {
      const serverId = String(server._id);
      
      await this.options.queue.upsertJobScheduler(
        collectGameDataSchedulerId(serverId),
        { every: this.intervalMs },
        {
          name: COLLECT_GAME_DATA_JOB,
          data: {
            job: AGENT_JOB_TYPES.COLLECT_GAME_DATA,
            serverId,
            game: server.game,
            serverDirectory: server.server_directory as string,
            trigger: 'schedule',
          },
        }
      );
    }

    console.log(
      `[agent] Reconciled game-data schedulers (${eligible.length} eligible of ${configuration.servers.length})`
    );
  }

  public async runCollectGameData(serverId: string, opts: { requestId?: string } = {}): Promise<CollectGameDataJobResult> {
    const server = this.configuration?.servers.find((candidate) => String(candidate._id) === serverId);

    if (!server) {
      throw new AgentCommandError('unknown_server', `Unknown game server '${serverId}'`);
    }

    if (!COLLECT_GAME_DATA_GAMES.has(server.game)) {
      throw new AgentCommandError('unsupported_game', `Game '${server.game}' does not support collect-game-data`);
    }

    if (!server.server_directory) {
      throw new AgentCommandError('missing_directory', `Game server '${serverId}' has no server_directory`);
    }

    const job = await this.options.queue.add(
      COLLECT_GAME_DATA_JOB,
      {
        job: AGENT_JOB_TYPES.COLLECT_GAME_DATA,
        serverId,
        game: server.game,
        serverDirectory: server.server_directory,
        requestId: opts.requestId,
        trigger: 'on-demand',
      },
      { jobId: `${COLLECT_GAME_DATA_JOB}-${serverId}-ondemand-${randomUUID()}` }
    );

    const jobId = String(job.id);

    return new Promise<CollectGameDataJobResult>((resolve, reject) => {
      this.inFlight.set(jobId, { resolve, reject });
    });
  }

  public async cancelCollectGameData(serverId: string): Promise<void> {
    const waiting = await this.options.queue.getJobs(['wait', 'waiting', 'delayed', 'paused', 'prioritized']);

    for (const job of waiting) {
      if (job.data?.job !== AGENT_JOB_TYPES.COLLECT_GAME_DATA || String(job.data.serverId) !== serverId) {
        continue;
      }

      const pending = job.id ? this.inFlight.get(String(job.id)) : undefined;

      await job.remove();

      if (pending) {
        pending.reject(new AgentCommandError('cancelled', `collect-game-data for '${serverId}' was cancelled`));
        this.inFlight.delete(String(job.id));
      }
    }

    const workers = this.activeParses.get(serverId);

    if (workers) {
      await Promise.all([...workers].map((worker) => worker.terminate()));
      this.activeParses.delete(serverId);
    }
  }

  public async processJob(job: Job<CollectGameDataJobData>): Promise<CollectGameDataJobResult> {
    const { serverId, serverDirectory, requestId, game } = job.data;
    this.report(requestId, { status: 'running', message: 'Collecting game data' });

    const { worker, result } = runArkParse(serverDirectory, game);

    this.trackParse(serverId, worker);

    try {
      const snapshot = await result;
      await uploadGameDataSnapshot(this.options.apiUrl, this.options.getAccessToken(), serverId, snapshot);

      const summary: CollectGameDataJobResult = {
        serverId,
        game,
        playerCount: snapshot.players.length,
        tribeCount: snapshot.tribes.length,
        collectedAt: snapshot.collectedAt,
      };

      this.inFlight.get(String(job.id))?.resolve(summary);
      return summary;
    } catch (err) {
      this.inFlight.get(String(job.id))?.reject(err);
      throw err;
    } finally {
      this.untrackParse(serverId, worker);
      this.inFlight.delete(String(job.id));
    }
  }

  private report(requestId: string | undefined, update: Partial<AgentCommandProgress>): void {
    if (!requestId || !this.emitCommandProgress) {
      return;
    }

    this.emitCommandProgress({
      requestId,
      status: update.status ?? 'running',
      message: update.message,
      data: update.data,
      error: update.error,
      timestamp: new Date().toISOString(),
    });
  }

  private trackParse(serverId: string, worker: Worker): void {
    const workers = this.activeParses.get(serverId) ?? new Set<Worker>(); 
    workers.add(worker);
    this.activeParses.set(serverId, workers);
  }

  private untrackParse(serverId: string, worker: Worker): void {
    const workers = this.activeParses.get(serverId);

    if (!workers) {
      return;
    }

    workers.delete(worker);

    if (workers.size === 0) {
      this.activeParses.delete(serverId);
    }
  }
}
