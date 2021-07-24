import { Entity, Column } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';

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
}
