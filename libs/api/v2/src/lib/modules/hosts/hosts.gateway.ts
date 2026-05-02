import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HostsService } from './hosts.service';
import { AgentsService } from '../agents/agents.service';
import { machineAuthConfig } from '../../config/machine-auth.config';

@WebSocketGateway({
  namespace: '/hosts',
  cors: { origin: '*' }, // TODO: This will need to be locked down in production
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class HostsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HostsGateway.name);

  constructor(private readonly hostsService: HostsService, private readonly agentsService: AgentsService) {}

  afterInit(server: Server) {
    // Only enforce auth middleware if MACHINE_JWT_SECRET is configured
    if (!machineAuthConfig.machineJwtSecret) {
      this.logger.warn('MACHINE_JWT_SECRET not set — Socket.IO auth middleware is DISABLED');
      return;
    }

    server.use((socket, next) => {
      const { token, agentId } = socket.handshake.auth || {};

      if (!token || !agentId) {
        return next(new Error('invalid_token'));
      }

      try {
        const payload = this.agentsService.verifyAccessToken(token);
        if (payload.agentId !== agentId) {
          return next(new Error('invalid_token'));
        }
        socket.data = { agentId: payload.agentId, roles: payload.roles };
        next();
      } catch {
        return next(new Error('invalid_token'));
      }
    });

    this.logger.log('Socket.IO auth middleware installed');
  }

  handleConnection(client: Socket) {
    const agentId = client.data?.agentId;
    this.logger.log(`Client connected: ${client.id} (agent: ${agentId || 'unauthenticated'})`);

    if (agentId) {
      client.join(`agent:${agentId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const agentId = client.data?.agentId;
    const key = client.data?.key;
    this.logger.log(`Client disconnected: ${client.id} (agent: ${agentId || key || 'unknown'})`);

    // Support both new agentId-based and legacy key-based disconnect
    const identifier = agentId || key;
    if (identifier) {
      await this.hostsService.setHostOffline(identifier);
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() payload: { key: string; hostname: string; system: any; timestamp: string },
    @ConnectedSocket() client: Socket
  ) {
    // Use authenticated agentId if available, fall back to payload key
    const agentId = client.data?.agentId || payload.key;
    this.logger.log(`Registration from ${agentId}`);

    const host = await this.hostsService.registerHost({ ...payload, key: agentId });

    // Store identifier on socket for disconnect lookup
    client.data = { ...client.data, key: agentId };

    client.emit('registered', {
      success: true,
      hostId: host._id,
      status: host.status,
    });
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(
    @MessageBody() payload: { key: string; system: any; timestamp: string },
    @ConnectedSocket() client: Socket
  ) {
    const agentId = client.data?.agentId || payload.key;
    await this.hostsService.processHeartbeat(agentId, payload.system);

    client.emit('heartbeat-ack', {
      success: true,
      timestamp: new Date().toISOString(),
    });
  }
}
