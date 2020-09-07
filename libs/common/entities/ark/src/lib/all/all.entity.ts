import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { SteamProfile } from '@supremegaming/common/entities/steam';
import { Server } from '@supremegaming/common/entities/servers';

@Entity({ name: 'tribes' })
export class Tribe extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

  @Column()
  public name: string;

  @OneToMany((type) => Player, (player) => player.tribe)
  public players: Player[];

  @ManyToOne((type) => Server)
  public server: Server;
}

@Entity({ name: 'players' })
export class Player extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

  @Column()
  public name: string;

  @Column()
  public level: number;

  @Column()
  public engrams: number;

  @ManyToOne((type) => Server)
  public server: Server;

  @ManyToOne((type) => Tribe, (tribe) => tribe.players)
  public tribe: Tribe;

  @ManyToOne((type) => SteamProfile)
  public profile: SteamProfile;
}
