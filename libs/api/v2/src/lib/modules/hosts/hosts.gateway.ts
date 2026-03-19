import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HostsService } from './hosts.service';

@WebSocketGateway({ namespace: '/hosts', cors: { origin: '*' } })
export class HostsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HostsGateway.name);

  constructor(private readonly hostsService: HostsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const key = client.data?.key;
    if (key) {
      await this.hostsService.setHostOffline(key);
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() payload: { key: string; hostname: string; system: any; timestamp: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Registration from ${payload.key}`);

    const host = await this.hostsService.registerHost(payload);

    // Store the key on the socket for disconnect lookup
    client.data = { key: payload.key };

    client.emit('registered', {
      success: true,
      hostId: host._id,
      status: host.status,
    });
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(
    @MessageBody() payload: { key: string; system: any; timestamp: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.hostsService.processHeartbeat(payload.key, payload.system);

    client.emit('heartbeat-ack', {
      success: true,
      timestamp: new Date().toISOString(),
    });
  }
}
