import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ServersService } from './servers.service';
import { GameServer } from './schemas/game-server.schema';
import { HostServer } from '../hosts/schemas/host-server.schema';
import { CreateGameServerDto } from './dto/create-game-server.dto';

describe('ServersService', () => {
  let service: ServersService;
  const save = jest.fn();
  const gsModel: any = jest.fn().mockImplementation(() => ({ save }));
  gsModel.findById = jest.fn();
  gsModel.findByIdAndUpdate = jest.fn();
  gsModel.findByIdAndDelete = jest.fn();
  gsModel.exists = jest.fn();
  const hsModel = {
    findById: jest.fn(),
  };

  const hostId = '507f191e810c19729de860ea';
  const serverId = '507f1f77bcf86cd799439011';
  const createPayload: CreateGameServerDto = {
    host: hostId,
    port: 7777,
    rconport: 27020,
    game: 'ark',
    rconpass: 'secret',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    gsModel.mockImplementation(() => ({ save }));

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

  describe('createGameServer', () => {
    it('creates the server when the host exists and ports are free', async () => {
      const created = { _id: serverId };
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: hostId }) });
      gsModel.exists.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      save.mockResolvedValue(created);

      await expect(service.createGameServer(createPayload)).resolves.toEqual(created);
      expect(gsModel.exists).toHaveBeenCalledWith({
        host: hostId,
        $or: [{ port: { $in: [7777, 27020] } }, { rconport: { $in: [7777, 27020] } }],
      });
    });

    it('rejects a host that does not exist', async () => {
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.createGameServer(createPayload)).rejects.toBeInstanceOf(UnprocessableEntityException);
      expect(gsModel.exists).not.toHaveBeenCalled();
    });

    it('rejects when another server on the host already uses the port', async () => {
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: hostId }) });
      gsModel.exists.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: serverId }) });

      await expect(service.createGameServer(createPayload)).rejects.toBeInstanceOf(ConflictException);
      expect(save).not.toHaveBeenCalled();
    });
  });

  describe('updateGameServer', () => {
    it('updates the server when it exists', async () => {
      const updated = { _id: serverId, port: 7778 };
      gsModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: serverId, host: hostId, port: 7777, rconport: 27020 }),
      });
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: hostId }) });
      gsModel.exists.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      gsModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

      await expect(service.updateGameServer(serverId, { port: 7778 })).resolves.toEqual(updated);
      expect(gsModel.exists).toHaveBeenCalledWith({
        host: hostId,
        _id: { $ne: serverId },
        $or: [{ port: { $in: [7778, 27020] } }, { rconport: { $in: [7778, 27020] } }],
      });
      expect(gsModel.findByIdAndUpdate).toHaveBeenCalledWith(serverId, { port: 7778 }, { new: true, runValidators: true });
    });

    it('skips the port check when the patch does not change host or ports', async () => {
      const updated = { _id: serverId, map_name: 'TheIsland' };
      gsModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

      await expect(service.updateGameServer(serverId, { map_name: 'TheIsland' })).resolves.toEqual(updated);
      expect(gsModel.findById).not.toHaveBeenCalled();
      expect(gsModel.exists).not.toHaveBeenCalled();
    });

    it('rejects a host that does not exist', async () => {
      gsModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: serverId, host: hostId, port: 7777, rconport: 27020 }),
      });
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.updateGameServer(serverId, { host: hostId })).rejects.toBeInstanceOf(
        UnprocessableEntityException
      );
      expect(gsModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('rejects when the new port conflicts with another server on the host', async () => {
      gsModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: serverId, host: hostId, port: 7777, rconport: 27020 }),
      });
      hsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: hostId }) });
      gsModel.exists.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: 'other' }) });

      await expect(service.updateGameServer(serverId, { port: 7778 })).rejects.toBeInstanceOf(ConflictException);
      expect(gsModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the server does not exist', async () => {
      gsModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.updateGameServer(serverId, { map_name: 'TheIsland' })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteGameServer', () => {
    it('deletes the server when it exists', async () => {
      gsModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: serverId }) });

      await expect(service.deleteGameServer(serverId)).resolves.toBeUndefined();
      expect(gsModel.findByIdAndDelete).toHaveBeenCalledWith(serverId);
    });

    it('throws NotFoundException when the server does not exist', async () => {
      gsModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.deleteGameServer(serverId)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
