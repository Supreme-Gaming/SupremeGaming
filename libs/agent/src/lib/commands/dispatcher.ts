import {
  AgentCommand,
  AgentCommandProgress,
  AgentCommandStatus,
  isTerminalAgentCommandStatus,
} from '../protocol';
import { AgentCommandError } from './errors';

export type AgentCommandReporter = (update: Partial<AgentCommandProgress> & { status?: AgentCommandStatus }) => void;

export type AgentCommandHandler = (command: AgentCommand, report: AgentCommandReporter) => Promise<void>;

export class AgentCommandDispatcher {
  private readonly handlers = new Map<string, AgentCommandHandler>();

  public register(type: string, handler: AgentCommandHandler): void {
    this.handlers.set(type, handler);
  }

  public async execute(command: AgentCommand, emit: (progress: AgentCommandProgress) => void): Promise<void> {
    if (!command?.requestId || !command.type) {
      return;
    }

    let lastStatus: AgentCommandStatus = 'accepted';

    const report: AgentCommandReporter = (update) => {
      lastStatus = update.status ?? lastStatus;
      emit({
        ...update,
        requestId: command.requestId,
        status: lastStatus,
        timestamp: update.timestamp ?? new Date().toISOString(),
      });
    };

    report({ status: 'accepted' });

    const handler = this.handlers.get(command.type);
    if (!handler) {
      report({
        status: 'rejected',
        error: { code: 'unknown_command', message: `Unknown command type: ${command.type}` },
      });
      return;
    }

    try {
      if (!isTerminalAgentCommandStatus(lastStatus)) {
        report({ status: 'running' });
      }
      await handler(command, report);
      if (!isTerminalAgentCommandStatus(lastStatus)) {
        report({ status: 'succeeded' });
      }
    } catch (err) {
      if (isTerminalAgentCommandStatus(lastStatus)) {
        return;
      }
      const code = err instanceof AgentCommandError ? err.code : 'command_failed';
      const message = err instanceof Error ? err.message : String(err);
      report({
        status: 'failed',
        error: { code, message },
      });
    }
  }
}
