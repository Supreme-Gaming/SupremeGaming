import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Server } from '@supremegaming/common/entities/servers';

@Injectable()
export class ServersService {
  constructor(@InjectRepository(Server) private readonly serverRepo: Repository<Server>) {}

  public async getAllServers(includeSensitive?: boolean) {
    if (includeSensitive) {
      return this.serverRepo.find();
    } else {
      const servers = await this.serverRepo.find();

      return servers.map((s) => Server.clean(s));
    }
  }

  public async getServerByProps(whereProps: Partial<Server>, includeSensitive?: boolean) {
    const server = await this.serverRepo.findOne({
      where: whereProps,
    });

    if (includeSensitive) {
      return server;
    } else {
      return Server.clean(server);
    }
  }

  public async createServer(server: Partial<Server>) {
    const s = this.serverRepo.create(server);

    return await s.save();
  }

  public async executeServerCommand(server: Server, command: string) {
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
