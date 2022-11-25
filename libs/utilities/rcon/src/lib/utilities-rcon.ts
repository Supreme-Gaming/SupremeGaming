import * as Rcon from 'srcds-rcon';

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

// This is here purely because there is a circular dependency between the entities and the utilities
export interface IHostServer {
  name: string;
  ip: string;
  status: 'register' | string;
  key: string;
}

export interface RconServerConnectionOptions {
  host: IHostServer;
  rconport: number;
  rconpass: string;
  game: string;
}

export interface RCONConnection {
  connect: () => Promise<string>;
  disconnect: () => Promise<string>;
  command: (command) => Promise<string>;
}
