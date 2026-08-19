export const AGENT_SOCKET_EVENTS = {
  COMMAND: 'command',
  COMMAND_PROGRESS: 'command:progress',
} as const;

export const AGENT_COMMAND_TYPES = {
  LIST_DIRECTORY: 'list-directory',
} as const;

export type AgentCommandType = (typeof AGENT_COMMAND_TYPES)[keyof typeof AGENT_COMMAND_TYPES] | string;

export type AgentCommandStatus = 'queued' | 'accepted' | 'running' | 'succeeded' | 'failed' | 'rejected';

export const TERMINAL_AGENT_COMMAND_STATUSES: ReadonlySet<AgentCommandStatus> = new Set([
  'succeeded',
  'failed',
  'rejected',
]);

export function isTerminalAgentCommandStatus(status: AgentCommandStatus): boolean {
  return TERMINAL_AGENT_COMMAND_STATUSES.has(status);
}

export interface AgentCommand<T = unknown> {
  requestId: string;
  type: AgentCommandType;
  payload: T;
  issuedAt: string;
}

export interface AgentCommandErrorBody {
  code: string;
  message: string;
}

export interface AgentCommandProgress<T = unknown> {
  requestId: string;
  status: AgentCommandStatus;
  /** 0–100, when status is `running`. */
  progress?: number;
  message?: string;
  data?: T;
  error?: AgentCommandErrorBody;
  timestamp: string;
}

export interface ListDirectoryPayload {
  path: string;
}

export interface DirectoryEntry {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'other';
  sizeBytes?: number;
  modifiedAt?: string;
}

export interface ListDirectoryResult {
  path: string;
  truncated: boolean;
  entries: DirectoryEntry[];
}
