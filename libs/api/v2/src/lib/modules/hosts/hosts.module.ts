import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from './schemas/host-server.schema';
import { HostsController } from './hosts.controller';
import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: HostServer.name, schema: HostServerSchema }]), AgentsModule],
  controllers: [HostsController],
  providers: [HostsService, HostsGateway],
})
export class HostsModule {}
