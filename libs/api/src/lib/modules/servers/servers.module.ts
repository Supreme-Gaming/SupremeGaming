import { DynamicModule, Module } from '@nestjs/common';

import { Server } from '@supremegaming/common/entities/servers';

import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { SERVERS } from './types/types';

@Module({})
export class ServersModule {
  public static forRoot(servers: Array<Partial<Server>>): DynamicModule {
    return {
      module: ServersModule,
      controllers: [ServersController],
      providers: [
        ServersService,
        {
          provide: SERVERS,
          useValue: servers,
        },
      ],
    };
  }
}
