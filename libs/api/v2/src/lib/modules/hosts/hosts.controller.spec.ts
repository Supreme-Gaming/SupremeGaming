import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { HostServer } from './schemas/host-server.schema';

describe('HostsController', () => {
  let controller: HostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostsController],
      providers: [HostsService, { provide: getModelToken(HostServer.name), useValue: {} }],
    }).compile();

    controller = module.get<HostsController>(HostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
