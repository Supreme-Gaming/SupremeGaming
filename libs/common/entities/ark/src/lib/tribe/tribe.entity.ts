import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { GameServer } from '@supremegaming/common/entities/servers';

import { Player } from '../player/player.entity';

@Entity({ name: 'cache_ark_tribes' })
export class Tribe extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

  @Column()
  public name: string;

  @OneToMany((type) => Player, (player) => player.tribe)
  public players: Player[];

  @ManyToOne((type) => GameServer)
  public server: GameServer;
}
