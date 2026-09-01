import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AGENT_SOCKET_EVENTS, type AgentHostConfiguration } from '@supremegaming/agent/core';

import { AgentSocketBridge } from './agent-socket.bridge';
import { HostsService } from './hosts.service';
import { GameServer, GameServerDocument } from '../servers/schemas/game-server.schema';

@Injectable()
export class HostConfigurationPublisher {
  private readonly logger = new Logger(HostConfigurationPublisher.name);

  constructor(
    private readonly hostsService: HostsService,
    private readonly socketBridge: AgentSocketBridge,
    @InjectModel(GameServer.name) private readonly gsModel: Model<GameServerDocument>
  ) {}

  public async publishToClient(
    client: { emit: (event: string, payload: unknown) => void },
    agentId: string,
    hostId?: string | Types.ObjectId
  ): Promise<void> {
    const configuration = await this.buildConfiguration(agentId, hostId);

    if (!configuration) {
      this.logger.debug(`No host record for agent ${agentId}; skipping configuration`);
      return;
    }

    client.emit(AGENT_SOCKET_EVENTS.CONFIGURATION, configuration);
  }

  public async publishForHost(hostId: string | Types.ObjectId): Promise<void> {
    try {
      const host = await this.hostsService.getHostById(hostId);
      const agentId = host?.agentId || host?.key;

      if (!agentId) {
        this.logger.debug(`Host ${hostId} has no agentId/key; skipping configuration emit`);
        return;
      }

      const configuration = await this.loadConfiguration(host._id);

      this.socketBridge.emitToAgent(agentId, AGENT_SOCKET_EVENTS.CONFIGURATION, configuration);
    } catch (err) {
      if (err instanceof ServiceUnavailableException) {
        this.logger.debug(`Agent socket server is not ready; skipping configuration emit for host ${hostId}`);
        return;
      }

      this.logger.error(`Failed to publish configuration for host ${hostId}`, err);
    }
  }

  private async buildConfiguration(
    agentId: string,
    hostId?: string | Types.ObjectId
  ): Promise<AgentHostConfiguration | null> {
    const resolvedHostId = hostId ?? (await this.hostsService.getHostByAgentId(agentId))?._id;
    
    if (!resolvedHostId) {
      return null;
    }

    return this.loadConfiguration(resolvedHostId);
  }

  private async loadConfiguration(hostId: string | Types.ObjectId): Promise<AgentHostConfiguration> {
    return {
      hostId: String(hostId),
      servers: (await this.gsModel.find({ host: hostId }).lean().exec()) as unknown as AgentHostConfiguration['servers'],
    };
  }
}
