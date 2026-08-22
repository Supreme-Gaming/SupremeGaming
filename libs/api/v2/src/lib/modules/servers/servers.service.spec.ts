import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ServersService } from './servers.service';
import { GameServer } from './schemas/game-server.schema';
import { HostServer } from '../hosts/schemas/host-server.schema';

describe('ServersService', () => {
  let service: ServersService;
  const gsModel = {
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  const hsModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServersService,
        { provide: getModelToken(GameServer.name), useValue: gsModel },
        { provide: getModelToken(HostServer.name), useValue: hsModel },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateGameServer', () => {
    it('updates the server when it exists', async () => {
      const updated = { _id: '507f1f77bcf86cd799439011', port: 7778 };
      gsModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

      await expect(service.updateGameServer('507f1f77bcf86cd799439011', { port: 7778 })).resolves.toEqual(updated);
      expect(hsModel.findById).not.toHaveBeenCalled();
      expect(gsModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { port: 7778 },
        { new: true, runValidators: true }
      );
    });

    it('rejects a host that does not exist', async () => {
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(
        service.updateGameServer('507f1f77bcf86cd799439011', { host: '507f191e810c19729de860ea' })
      ).rejects.toBeInstanceOf(UnprocessableEntityException);
      expect(gsModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the server does not exist', async () => {
      gsModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.updateGameServer('507f1f77bcf86cd799439011', { port: 7778 })).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });

  describe('deleteGameServer', () => {
    it('deletes the server when it exists', async () => {
      gsModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }) });

      await expect(service.deleteGameServer('507f1f77bcf86cd799439011')).resolves.toBeUndefined();
      expect(gsModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('throws NotFoundException when the server does not exist', async () => {
      gsModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.deleteGameServer('507f1f77bcf86cd799439011')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
