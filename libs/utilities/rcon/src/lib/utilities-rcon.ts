import * as Rcon from 'srcds-rcon';

export class RCONServer {
  public host: string;
  public rconport: number;
  public rconpass: string;
  public game: string;

  public connection: IRcon;

  constructor(connectionOptions: RconServerConnectionOptions) {
    this.host = connectionOptions.host;
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
  host: string;
  rconport: number;
  rconpass: string;
  game: string;
}

export interface IRcon {
  connect: () => string;
  disconnect: () => void;
  command: (command) => string;
}
