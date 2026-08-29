import { Injectable, Logger, MessageEvent, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { randomUUID } from 'crypto';
import {
  AGENT_SOCKET_EVENTS,
  type AgentCommand,
  type AgentCommandProgress,
  isTerminalAgentCommandStatus,
} from '@supremegaming/agent/core';

import { AgentSocketBridge } from './agent-socket.bridge';
import { IssueAgentCommandDto } from './dto/issue-agent-command.dto';
import { HostsService } from './hosts.service';

const DEFAULT_WAIT_TIMEOUT_MS = 30_000;
const COMPLETED_TTL_MS = 5 * 60 * 1000;

interface TrackedCommand {
  requestId: string;
  agentId: string;
  type: string;
  latest: AgentCommandProgress;
  subject: Subject<AgentCommandProgress>;
}

export interface IssueAgentCommandOptions {
  wait?: boolean;
  timeoutMs?: number;
}

export interface IssuedAgentCommand {
  requestId: string;
  agentId: string;
  type: string;
  timedOut?: boolean;
  result: AgentCommandProgress;
}

@Injectable()
export class AgentCommandsService {
  private readonly logger = new Logger(AgentCommandsService.name);
  private readonly commands = new Map<string, TrackedCommand>();

  public constructor(
    private readonly hostsService: HostsService,
    private readonly bridge: AgentSocketBridge
  ) {}

  public async issue(
    agentId: string,
    body: IssueAgentCommandDto,
    options: IssueAgentCommandOptions = {}
  ): Promise<IssuedAgentCommand> {
    const host = await this.hostsService.getHostByAgentId(agentId);
    if (!host) {
      throw new NotFoundException(`Unknown agent '${agentId}'`);
    }

    const connected = await this.bridge.connectedCount(agentId);
    if (connected === 0) {
      throw new ServiceUnavailableException({
        error: 'agent_offline',
        message: `Agent '${agentId}' is not connected`,
        agentId,
      });
    }

    const requestId = randomUUID();
    const issuedAt = new Date().toISOString();
    const command: AgentCommand = {
      requestId,
      type: body.type,
      payload: body.payload ?? {},
      issuedAt,
    };

    const tracked = this.track(agentId, body.type, {
      requestId,
      status: 'queued',
      timestamp: issuedAt,
    });

    this.bridge.emitToAgent(agentId, AGENT_SOCKET_EVENTS.COMMAND, command);
    this.logger.log(`Dispatched ${body.type} to agent ${agentId} (${requestId})`);

    if (!options.wait) {
      return this.toResponse(tracked);
    }

    const timeoutMs = options.timeoutMs && options.timeoutMs > 0 ? options.timeoutMs : DEFAULT_WAIT_TIMEOUT_MS;
    const completed = await this.waitForTerminal(tracked, timeoutMs);
    return this.toResponse(tracked, { timedOut: !completed });
  }

  public getCommand(agentId: string, requestId: string): IssuedAgentCommand {
    return this.toResponse(this.getTracked(agentId, requestId));
  }

  public observe(agentId: string, requestId: string): Observable<MessageEvent> {
    const tracked = this.getTracked(agentId, requestId);

    return new Observable((subscriber) => {
      subscriber.next({ data: tracked.latest });

      if (isTerminalAgentCommandStatus(tracked.latest.status)) {
        subscriber.complete();
        return;
      }

      const sub = tracked.subject.subscribe({
        next: (progress) => {
          subscriber.next({ data: progress });
          if (isTerminalAgentCommandStatus(progress.status)) {
            subscriber.complete();
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => sub.unsubscribe();
    });
  }

  public recordProgress(agentId: string, progress: AgentCommandProgress): void {
    if (!progress?.requestId) {
      return;
    }

    const tracked = this.commands.get(progress.requestId);
    if (!tracked) {
      this.logger.debug(`Progress for unknown command ${progress.requestId} from ${agentId}`);
      return;
    }

    if (tracked.agentId !== agentId) {
      this.logger.warn(
        `Ignoring progress for ${progress.requestId}: agent ${agentId} does not own this command (${tracked.agentId})`
      );
      return;
    }

    const snapshot: AgentCommandProgress = {
      ...progress,
      requestId: tracked.requestId,
      timestamp: progress.timestamp || new Date().toISOString(),
    };

    tracked.latest = snapshot;
    tracked.subject.next(snapshot);

    if (isTerminalAgentCommandStatus(snapshot.status)) {
      tracked.subject.complete();
      this.scheduleCleanup(tracked.requestId);
    }
  }

  private track(agentId: string, type: string, latest: AgentCommandProgress): TrackedCommand {
    const tracked: TrackedCommand = {
      requestId: latest.requestId,
      agentId,
      type,
      latest,
      subject: new Subject<AgentCommandProgress>(),
    };
    this.commands.set(latest.requestId, tracked);
    return tracked;
  }

  private getTracked(agentId: string, requestId: string): TrackedCommand {
    const tracked = this.commands.get(requestId);
    if (!tracked || tracked.agentId !== agentId) {
      throw new NotFoundException(`Unknown command '${requestId}' for agent '${agentId}'`);
    }
    return tracked;
  }

  private waitForTerminal(tracked: TrackedCommand, timeoutMs: number): Promise<boolean> {
    if (isTerminalAgentCommandStatus(tracked.latest.status)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        sub.unsubscribe();
        resolve(false);
      }, timeoutMs);

      const sub = tracked.subject.subscribe((progress) => {
        if (isTerminalAgentCommandStatus(progress.status)) {
          clearTimeout(timer);
          sub.unsubscribe();
          resolve(true);
        }
      });
    });
  }

  private toResponse(tracked: TrackedCommand, extras: { timedOut?: boolean } = {}): IssuedAgentCommand {
    return {
      requestId: tracked.requestId,
      agentId: tracked.agentId,
      type: tracked.type,
      result: tracked.latest,
      ...(extras.timedOut ? { timedOut: true } : {}),
    };
  }

  private scheduleCleanup(requestId: string): void {
    setTimeout(() => this.commands.delete(requestId), COMPLETED_TTL_MS).unref?.();
  }
}
