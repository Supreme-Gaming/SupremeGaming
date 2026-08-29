import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { HostServer, HostServerDocument } from '../hosts/schemas/host-server.schema';
import { IngestGameDataDto } from './dto/ingest-game-data.dto';
import { GameServer, GameServerDocument } from './schemas/game-server.schema';
import { GameServerPlayer, GameServerPlayerDocument } from './schemas/game-server-player.schema';
import { GameServerTribe, GameServerTribeDocument } from './schemas/game-server-tribe.schema';

@Injectable()
export class GameDataService {
  constructor(
    @InjectModel(GameServer.name) private readonly gsModel: Model<GameServerDocument>,
    @InjectModel(HostServer.name) private readonly hsModel: Model<HostServerDocument>,
    @InjectModel(GameServerPlayer.name) private readonly playerModel: Model<GameServerPlayerDocument>,
    @InjectModel(GameServerTribe.name) private readonly tribeModel: Model<GameServerTribeDocument>
  ) {}

  public async ingestGameData(serverId: string, agentId: string, snapshot: IngestGameDataDto) {
    const server = await this.gsModel.findById(serverId).exec();
    
    if (!server) {
      throw new NotFoundException();
    }

    const host = await this.hsModel.findById(server.host).exec();
    const owner = host?.agentId || host?.key;

    if (!host || owner !== agentId) {
      throw new ForbiddenException('Agent does not own this game server');
    }

    const collectedAt = new Date(snapshot.collectedAt);
    const serverObjectId = server._id as Types.ObjectId;

    const playerOps = snapshot.players.map((player) => ({
      updateOne: {
        filter: { server: serverObjectId, PlayerId: player.PlayerId },
        update: {
          $set: {
            server: serverObjectId,
            game: snapshot.game,
            collectedAt,
            PlayerName: player.PlayerName,
            Level: player.Level,
            TotalEngramPoints: player.TotalEngramPoints,
            CharacterName: player.CharacterName,
            TribeId: player.TribeId,
            EosId: player.EosId,
            PlayerId: player.PlayerId,
            FileCreated: player.FileCreated,
            FileUpdated: player.FileUpdated,
          },
        },
        upsert: true,
      },
    }));

    if (playerOps.length > 0) {
      await this.playerModel.bulkWrite(playerOps);
    }

    await this.playerModel.deleteMany({ server: serverObjectId, collectedAt: { $lt: collectedAt } }).exec();

    const tribeOps = snapshot.tribes.map((tribe) => ({
      updateOne: {
        filter: { server: serverObjectId, Id: tribe.Id },
        update: {
          $set: {
            server: serverObjectId,
            game: snapshot.game,
            collectedAt,
            Name: tribe.Name,
            OwnerId: tribe.OwnerId,
            Id: tribe.Id,
            TribeLogs: tribe.TribeLogs ?? [],
            TribeMemberNames: tribe.TribeMemberNames ?? [],
            FileCreated: tribe.FileCreated,
            FileUpdated: tribe.FileUpdated,
          },
        },
        upsert: true,
      },
    }));

    if (tribeOps.length > 0) {
      await this.tribeModel.bulkWrite(tribeOps);
    }

    await this.tribeModel.deleteMany({ server: serverObjectId, collectedAt: { $lt: collectedAt } }).exec();

    return {
      serverId,
      game: snapshot.game,
      collectedAt: collectedAt.toISOString(),
      players: snapshot.players.length,
      tribes: snapshot.tribes.length,
    };
  }
}
