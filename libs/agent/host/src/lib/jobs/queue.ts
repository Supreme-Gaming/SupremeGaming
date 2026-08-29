import { ConnectionOptions, Processor, Queue, Worker } from 'bullmq';

import { AGENT_JOB_TYPES } from '@supremegaming/agent/core';

export const HOST_AGENT_JOBS_QUEUE = 'host-agent-jobs';
export const COLLECT_GAME_DATA_JOB = AGENT_JOB_TYPES.COLLECT_GAME_DATA;
export const DEFAULT_GAME_DATA_INTERVAL_MS = 300_000;

export interface CollectGameDataJobData {
  job: typeof AGENT_JOB_TYPES.COLLECT_GAME_DATA;
  serverId: string;
  game: string;
  serverDirectory: string;
  requestId?: string;
  trigger: 'schedule' | 'on-demand';
}

export function collectGameDataSchedulerId(serverId: string): string {
  return `${COLLECT_GAME_DATA_JOB}:${serverId}`;
}

export function gameDataIntervalMs(env: NodeJS.ProcessEnv = process.env): number {
  const parsed = parseInt(env.GAME_DATA_INTERVAL_MS || String(DEFAULT_GAME_DATA_INTERVAL_MS), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GAME_DATA_INTERVAL_MS;
}

export function createHostAgentJobsQueue(connection: ConnectionOptions): Queue<CollectGameDataJobData> {
  return new Queue<CollectGameDataJobData>(HOST_AGENT_JOBS_QUEUE, { connection });
}

export function createHostAgentJobsWorker(
  connection: ConnectionOptions,
  processor: Processor<CollectGameDataJobData>
): Worker<CollectGameDataJobData> {
  return new Worker<CollectGameDataJobData>(HOST_AGENT_JOBS_QUEUE, processor, { connection });
}
