import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RCONServer } from '@supremegaming/utilities/rcon';

import { HostServer, HostServerDocument } from '../hosts/schemas/host-server.schema';
import { CreateGameServerDto } from './dto/create-game-server.dto';
import { UpdateGameServerDto } from './dto/update-game-server.dto';
import { GameServer, GameServerDocument } from './schemas/game-server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(GameServer.name) private readonly gsModel: Model<GameServerDocument>,
    @InjectModel(HostServer.name) private readonly hsModel: Model<HostServerDocument>
  ) {}

  public async getAllServers() {
    return this.gsModel.find().exec();
  }

  public async getServerByProps(whereProps: Partial<GameServer>) {
    const server = await this.gsModel.findOne(whereProps).exec();

    if (!server) {
      throw new NotFoundException();
    }

    return server;
  }

  public async createGameServer(server: CreateGameServerDto) {
    // Check if host exists, otherwise game server entry will fail.
    const hs = await this.hsModel.findById(server.host).exec();

    if (!hs) {
      throw new UnprocessableEntityException();
    }

    return new this.gsModel(server).save();
  }

  public async updateGameServer(id: string, update: UpdateGameServerDto) {
    const patch = Object.fromEntries(Object.entries(update).filter(([, value]) => value !== undefined));

    if (patch.host) {
      const hs = await this.hsModel.findById(patch.host).exec();

      if (!hs) {
        throw new UnprocessableEntityException();
      }
    }

    const updated = await this.gsModel.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).exec();

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  public async deleteGameServer(id: string): Promise<void> {
    const deleted = await this.gsModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException();
    }
  }

  public async executeServerCommand(server: GameServerDocument, command: string) {
    const populated = await server.populate('host');
    const host = populated.host as unknown as HostServerDocument;

    const rcon = new RCONServer({
      host: { name: host.hostname, ip: host.system?.network?.publicIp, status: host.status, key: host.key },
      rconport: server.rconport,
      rconpass: server.rconpass,
      game: server.game,
    });

    try {
      await rcon.connect();
      return await rcon.command(command);
    } finally {
      await rcon.disconnect();
    }
  }
}
