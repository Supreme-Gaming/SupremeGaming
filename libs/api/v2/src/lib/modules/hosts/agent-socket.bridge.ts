import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class AgentSocketBridge {
  private server: Server | null = null;

  public attach(server: Server): void {
    this.server = server;
  }

  public async connectedCount(agentId: string): Promise<number> {
    if (!this.server) {
      return 0;
    }

    const sockets = await this.server.in(`agent:${agentId}`).fetchSockets();
    return sockets.length;
  }

  public emitToAgent(agentId: string, event: string, payload: unknown): void {
    if (!this.server) {
      throw new ServiceUnavailableException('Agent socket server is not ready');
    }

    this.server.to(`agent:${agentId}`).emit(event, payload);
  }
}
