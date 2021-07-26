import { Entity, Column, ManyToOne } from 'typeorm';

import { Tribe } from '../tribe/tribe.entity';

import { GuidIdentity } from '@supremegaming/common/entities';
import { SteamProfile } from '@supremegaming/common/entities/steam';
import { GameServer } from '@supremegaming/common/entities/servers';

@Entity({ name: 'cache_ark_players' })
export class Player extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

  @Column()
  public name: string;

  @Column()
  public level: number;

  @Column()
  public engrams: number;

  @ManyToOne((type) => GameServer)
  public server: GameServer;

  @ManyToOne((type) => Tribe, (tribe) => tribe.players)
  public tribe: Tribe;

  @ManyToOne((type) => SteamProfile)
  public profile: SteamProfile;
}
