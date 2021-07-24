import { Entity, Column, AfterLoad } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { RCONServer } from '@supremegaming/utilities/rcon';

@Entity({ name: 'servers' })
export class Server extends GuidIdentity {
  @Column()
  public host: string;

  @Column()
  public port: number;

  @Column()
  public rconport: number;

  @Column()
  public rconpass: string;

  @Column()
  public shouldProcess: boolean;

  @Column()
  public server_directory: string;

  @Column()
  public server_alt_dir: string;

  @Column()
  public map_name: string;

  @Column()
  public game: 'ark' | 'atlas' | 'conan';

  public rcon: RCONServer;

  @AfterLoad()
  public attachRcon() {
    this.rcon = new RCONServer({
      host: this.host,
      rconpass: this.rconpass,
      rconport: this.rconport,
      game: this.game,
    });
  }

  public static clean(server: Partial<Server>) {
    const cloned: Server = Server.clone(server);

    delete cloned.rconpass;
    delete cloned.shouldProcess;
    delete cloned.server_directory;
    delete cloned.server_alt_dir;
    delete cloned.rcon;

    return cloned;
  }

  public static clone(server: Partial<Server>) {
    return JSON.parse(JSON.stringify(server));
  }
}
