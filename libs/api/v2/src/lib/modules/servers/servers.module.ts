import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AgentsModule } from '../agents/agents.module';
import { HostsModule } from '../hosts/hosts.module';
import { HostServer, HostServerSchema } from '../hosts/schemas/host-server.schema';
import { GameDataService } from './game-data.service';
import { GameServer, GameServerSchema } from './schemas/game-server.schema';
import { GameServerPlayer, GameServerPlayerSchema } from './schemas/game-server-player.schema';
import { GameServerTribe, GameServerTribeSchema } from './schemas/game-server-tribe.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameServer.name, schema: GameServerSchema },
      { name: HostServer.name, schema: HostServerSchema },
      { name: GameServerPlayer.name, schema: GameServerPlayerSchema },
      { name: GameServerTribe.name, schema: GameServerTribeSchema },
    ]),
    AgentsModule,
    HostsModule,
  ],
  controllers: [ServersController],
  providers: [ServersService, GameDataService],
  exports: [ServersService],
})
export class ServersModule {}
