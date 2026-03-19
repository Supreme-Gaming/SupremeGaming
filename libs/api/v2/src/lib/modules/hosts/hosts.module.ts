import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from './schemas/host-server.schema';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: HostServer.name, schema: HostServerSchema }])],
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
