import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HostServer } from '@supremegaming/common/entities/servers';

import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

@Module({
  imports: [TypeOrmModule.forFeature([HostServer])],
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
