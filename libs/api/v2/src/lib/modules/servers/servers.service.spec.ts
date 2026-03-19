import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ServersService } from './servers.service';
import { GameServer } from './schemas/game-server.schema';
import { HostServer } from '../hosts/schemas/host-server.schema';

describe('ServersService', () => {
  let service: ServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServersService,
        { provide: getModelToken(GameServer.name), useValue: {} },
        { provide: getModelToken(HostServer.name), useValue: {} },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
