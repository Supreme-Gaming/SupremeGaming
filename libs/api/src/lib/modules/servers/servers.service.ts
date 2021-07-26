import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameServer, HostServer } from '@supremegaming/common/entities/servers';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(GameServer) private readonly gsRepo: Repository<GameServer>,
    @InjectRepository(HostServer) private readonly hsRepo: Repository<HostServer>
  ) {}

  public async getAllServers(includeSensitive?: boolean) {
    if (includeSensitive) {
      return this.gsRepo.find();
    } else {
      const servers = await this.gsRepo.find();

      return servers.map((s) => GameServer.clean(s));
    }
  }

  public async getServerByProps(whereProps: Partial<GameServer>, includeSensitive?: boolean) {
    const server = await this.gsRepo.findOne({
      where: whereProps,
    });

    if (!server) {
      throw new NotFoundException();
    }

    if (includeSensitive) {
      return server;
    } else {
      return GameServer.clean(server);
    }
  }

  public async createGameServer(server: Partial<GameServer>) {
    // Check if host exists, otherwise game server entry will fail.
    const hs = await this.hsRepo.findOne({
      where: {
        guid: server.host,
      },
    });

    if (!hs) {
      throw new UnprocessableEntityException();
    }

    const gs = this.gsRepo.create({ ...server, host: hs });

    return await gs.save();
  }

  public async executeServerCommand(server: GameServer, command: string) {
    return server.rcon
      .connect()
      .then((status) => {
        return status;
      })
      .then((status) => {
        return server.rcon.command(command);
      })
      .finally(() => {
        return server.rcon.disconnect();
      });
  }
}
