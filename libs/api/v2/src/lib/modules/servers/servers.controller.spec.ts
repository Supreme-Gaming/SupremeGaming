import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { GameServer } from './schemas/game-server.schema';
import { HostServer } from '../hosts/schemas/host-server.schema';

describe('ServersController', () => {
  let controller: ServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [
        ServersService,
        { provide: getModelToken(GameServer.name), useValue: {} },
        { provide: getModelToken(HostServer.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<ServersController>(ServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
