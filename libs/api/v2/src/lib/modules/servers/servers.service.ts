import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RCONServer } from '@supremegaming/utilities/rcon';

import { HostServer, HostServerDocument } from '../hosts/schemas/host-server.schema';
import { GameServer, GameServerDocument } from './schemas/game-server.schema';

const SENSITIVE_FIELDS = ['rconpass', 'shouldProcess', 'server_directory', 'server_alt_dir'];

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(GameServer.name) private readonly gsModel: Model<GameServerDocument>,
    @InjectModel(HostServer.name) private readonly hsModel: Model<HostServerDocument>
  ) {}

  public async getAllServers(includeSensitive?: boolean) {
    const query = this.gsModel.find();

    if (!includeSensitive) {
      query.select(SENSITIVE_FIELDS.map((f) => `-${f}`).join(' '));
    }

    return query.exec();
  }

  public async getServerByProps(whereProps: Partial<GameServer>, includeSensitive?: boolean) {
    const query = this.gsModel.findOne(whereProps);

    if (!includeSensitive) {
      query.select(SENSITIVE_FIELDS.map((f) => `-${f}`).join(' '));
    }

    const server = await query.exec();

    if (!server) {
      throw new NotFoundException();
    }

    return server;
  }

  public async createGameServer(server: Partial<GameServer>) {
    // Check if host exists, otherwise game server entry will fail.
    const hs = await this.hsModel.findById(server.host).exec();

    if (!hs) {
      throw new UnprocessableEntityException();
    }

    return new this.gsModel(server).save();
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
