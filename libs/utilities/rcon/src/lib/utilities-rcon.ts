import * as Rcon from 'srcds-rcon';

import { HostServer } from '@supremegaming/common/entities/servers';

export class RCONServer {
  public host: string;
  public rconport: number;
  public rconpass: string;
  public game: string;

  private connection: RCONConnection;

  constructor(connectionOptions: RconServerConnectionOptions) {
    this.host = connectionOptions.host.ip;
    this.rconport = connectionOptions.rconport;
    this.rconpass = connectionOptions.rconpass;
    this.game = connectionOptions.game;

    this.connection = Rcon({
      address: this.host + ':' + this.rconport,
      password: this.rconpass,
      game: this.game,
    });
  }

  public connect() {
    return this.connection.connect();
  }

  public disconnect() {
    return this.connection.disconnect();
  }

  public command(command: string) {
    return this.connection.command(command);
  }
}

export interface RconServerConnectionOptions {
  host: HostServer;
  rconport: number;
  rconpass: string;
  game: string;
}

export interface RCONConnection {
  connect: () => Promise<string>;
  disconnect: () => Promise<string>;
  command: (command) => Promise<string>;
}
