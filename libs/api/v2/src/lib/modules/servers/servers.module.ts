import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from '../hosts/schemas/host-server.schema';
import { GameServer, GameServerSchema } from './schemas/game-server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameServer.name, schema: GameServerSchema },
      { name: HostServer.name, schema: HostServerSchema },
    ]),
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
