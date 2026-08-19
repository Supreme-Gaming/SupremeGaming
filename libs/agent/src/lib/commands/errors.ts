export class AgentCommandError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = 'AgentCommandError';
    this.code = code;
  }
}
