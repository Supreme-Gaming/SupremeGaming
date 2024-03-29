import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameServer, HostServer } from '@supremegaming/common/entities/servers';

import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameServer, HostServer])],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
