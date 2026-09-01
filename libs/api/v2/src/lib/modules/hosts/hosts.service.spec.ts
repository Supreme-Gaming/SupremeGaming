import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { HostsService } from './hosts.service';
import { HostServer } from './schemas/host-server.schema';

describe('HostsService', () => {
  let service: HostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HostsService, { provide: getModelToken(HostServer.name), useValue: {} }],
    }).compile();

    service = module.get<HostsService>(HostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
