import { Entity, Column, AfterLoad, ManyToOne } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { RCONServer } from '@supremegaming/utilities/rcon';

import { HostServer } from '../host-server/host-server.entity';

@Entity({ name: 'administration_game_servers' })
export class GameServer extends GuidIdentity {
  @ManyToOne(() => HostServer)
  public host: HostServer;

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
    this.rcon = new RCONServer(this);
  }

  public static clean(server: Partial<GameServer>) {
    const cloned: GameServer = GameServer.clone(server);

    delete cloned.rconpass;
    delete cloned.shouldProcess;
    delete cloned.server_directory;
    delete cloned.server_alt_dir;
    delete cloned.rcon;

    return cloned;
  }

  public static clone(server: Partial<GameServer>) {
    return JSON.parse(JSON.stringify(server));
  }
}
