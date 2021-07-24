import { Entity, Column, AfterLoad } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { RCONServer } from '@supremegaming/utilities/rcon';

@Entity({ name: 'servers' })
export class Server extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

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
}
