import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from './schemas/host-server.schema';
import { AgentCommandsService } from './agent-commands.service';
import { AgentSocketBridge } from './agent-socket.bridge';
import { HostsController } from './hosts.controller';
import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentsModule } from '../agents/agents.module';
import { ServersModule } from '../servers/servers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HostServer.name, schema: HostServerSchema }]),
    AgentsModule,
    ServersModule,
  ],
  controllers: [HostsController],
  providers: [HostsService, HostsGateway, AgentCommandsService, AgentSocketBridge],
})
export class HostsModule {}
