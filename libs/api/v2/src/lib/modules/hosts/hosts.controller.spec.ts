import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { HostServer } from './schemas/host-server.schema';
import { AgentCommandsService } from './agent-commands.service';

describe('HostsController', () => {
  let controller: HostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostsController],
      providers: [
        HostsService,
        { provide: getModelToken(HostServer.name), useValue: {} },
        { provide: AgentCommandsService, useValue: { issue: jest.fn(), getCommand: jest.fn(), observe: jest.fn() } },
      ],
    }).compile();

    controller = module.get<HostsController>(HostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
