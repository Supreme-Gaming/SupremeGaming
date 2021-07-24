import { Inject, Injectable } from '@nestjs/common';

import { Server } from '@supremegaming/common/entities/servers';

import { SERVERS } from './types/types';

@Injectable()
export class ServersService {
  constructor(@Inject(SERVERS) private servers: Array<Partial<Server>>) {}

  public getAllServers(includeSensitive?: boolean) {
    if (includeSensitive) {
      return this.servers;
    } else {
      return this.servers.map((s) => ServersService.cleanServer(s));
    }
  }

  public getServerByPort(port: number | string, includeSensitive?: boolean) {
    const server = this.servers.find((s) => {
      return s.port == port;
    });

    if (includeSensitive) {
      return server;
    } else {
      return ServersService.cleanServer(server);
    }
  }

  public getServerByRconPort(port: number | string, includeSensitive?: boolean) {
    const server = this.servers.find((s) => {
      return s.rconport == port;
    });

    if (includeSensitive) {
      return server;
    } else {
      return ServersService.cleanServer(server);
    }
  }

  private static cleanServer(server: Partial<Server>) {
    const cloned: Server = ServersService.cloneServer(server);

    delete cloned.rconpass;
    delete cloned.shouldProcess;
    delete cloned.server_directory;
    delete cloned.server_alt_dir;

    return cloned;
  }

  private static cloneServer(server: Partial<Server>) {
    return JSON.parse(JSON.stringify(server));
  }
}
