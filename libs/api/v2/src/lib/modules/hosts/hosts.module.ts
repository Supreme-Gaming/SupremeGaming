import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from './schemas/host-server.schema';
import { AgentCommandsService } from './agent-commands.service';
import { AgentSocketBridge } from './agent-socket.bridge';
import { HostConfigurationPublisher } from './host-configuration.publisher';
import { HostsController } from './hosts.controller';
import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentsModule } from '../agents/agents.module';
import { GameServer, GameServerSchema } from '../servers/schemas/game-server.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HostServer.name, schema: HostServerSchema },
      { name: GameServer.name, schema: GameServerSchema },
    ]),
    AgentsModule,
  ],
  controllers: [HostsController],
  providers: [HostsService, HostsGateway, AgentCommandsService, AgentSocketBridge, HostConfigurationPublisher],
  exports: [HostConfigurationPublisher],
})
export class HostsModule {}
