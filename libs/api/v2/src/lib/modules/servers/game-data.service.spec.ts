import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { HostServer } from '../hosts/schemas/host-server.schema';
import { IngestGameDataDto } from './dto/ingest-game-data.dto';
import { GameDataService } from './game-data.service';
import { GameServer } from './schemas/game-server.schema';
import { GameServerPlayer } from './schemas/game-server-player.schema';
import { GameServerTribe } from './schemas/game-server-tribe.schema';

describe('GameDataService', () => {
  let service: GameDataService;

  const serverId = '507f1f77bcf86cd799439011';
  const hostId = '507f191e810c19729de860ea';
  const collectedAt = '2026-08-23T07:00:00.000Z';

  const snapshot: IngestGameDataDto = {
    game: 'ark-ascended',
    collectedAt,
    players: [
      {
        PlayerName: 'Ada',
        Level: 80,
        TotalEngramPoints: 12,
        CharacterName: 'Ada',
        TribeId: 9,
        EosId: 'eos-1',
        PlayerId: 1001,
        FileCreated: collectedAt,
        FileUpdated: collectedAt,
      },
    ],
    tribes: [
      {
        Name: 'Alpha',
        OwnerId: 1001,
        Id: 9,
        TribeLogs: ['joined'],
        TribeMemberNames: ['Ada'],
        FileCreated: collectedAt,
        FileUpdated: collectedAt,
      },
    ],
  };

  const gsModel = {
    findById: jest.fn(),
  };
  const hsModel = {
    findById: jest.fn(),
  };
  const playerModel = {
    bulkWrite: jest.fn(),
    deleteMany: jest.fn(),
  };
  const tribeModel = {
    bulkWrite: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    playerModel.deleteMany.mockReturnValue({ exec: jest.fn().mockResolvedValue({ deletedCount: 0 }) });
    tribeModel.deleteMany.mockReturnValue({ exec: jest.fn().mockResolvedValue({ deletedCount: 0 }) });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameDataService,
        { provide: getModelToken(GameServer.name), useValue: gsModel },
        { provide: getModelToken(HostServer.name), useValue: hsModel },
        { provide: getModelToken(GameServerPlayer.name), useValue: playerModel },
        { provide: getModelToken(GameServerTribe.name), useValue: tribeModel },
      ],
    }).compile();

    service = module.get(GameDataService);
  });

  it('rejects a token whose agent does not own the server', async () => {
    gsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: serverId, host: hostId }) });
    hsModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: hostId, agentId: 'other-agent', key: 'other-agent' }),
    });

    await expect(service.ingestGameData(serverId, 'agent-1', snapshot)).rejects.toBeInstanceOf(ForbiddenException);
    expect(playerModel.bulkWrite).not.toHaveBeenCalled();
    expect(tribeModel.bulkWrite).not.toHaveBeenCalled();
  });

  it('rejects when the game server does not exist', async () => {
    gsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

    await expect(service.ingestGameData(serverId, 'agent-1', snapshot)).rejects.toBeInstanceOf(NotFoundException);
    expect(hsModel.findById).not.toHaveBeenCalled();
  });

  it('upserts the snapshot then deletes older rows so leavers disappear', async () => {
    gsModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: serverId, host: hostId }) });
    hsModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: hostId, agentId: 'agent-1', key: 'agent-1' }),
    });
    playerModel.bulkWrite.mockResolvedValue({});
    tribeModel.bulkWrite.mockResolvedValue({});

    await expect(service.ingestGameData(serverId, 'agent-1', snapshot)).resolves.toEqual({
      serverId,
      game: 'ark-ascended',
      collectedAt,
      players: 1,
      tribes: 1,
    });

    expect(playerModel.bulkWrite).toHaveBeenCalledWith([
      expect.objectContaining({
        updateOne: expect.objectContaining({
          filter: { server: serverId, PlayerId: 1001 },
          upsert: true,
        }),
      }),
    ]);
    expect(playerModel.deleteMany).toHaveBeenCalledWith({
      server: serverId,
      collectedAt: { $lt: new Date(collectedAt) },
    });
    expect(tribeModel.bulkWrite).toHaveBeenCalledWith([
      expect.objectContaining({
        updateOne: expect.objectContaining({
          filter: { server: serverId, Id: 9 },
          upsert: true,
        }),
      }),
    ]);
    expect(tribeModel.deleteMany).toHaveBeenCalledWith({
      server: serverId,
      collectedAt: { $lt: new Date(collectedAt) },
    });
  });
});
