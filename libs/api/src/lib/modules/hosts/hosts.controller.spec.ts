import { Test, TestingModule } from '@nestjs/testing';
import { HostsController } from './hosts.controller';

describe('HostsController', () => {
  let controller: HostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostsController],
    }).compile();

    controller = module.get<HostsController>(HostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
