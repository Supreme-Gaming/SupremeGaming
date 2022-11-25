import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';
import { GameServer } from '@supremegaming/common/entities/servers';

import { ArkPlayer } from '../player/player.entity';

@Entity({ name: 'cache_ark_tribes' })
export class ArkTribe extends GuidIdentity {
  @Column({ nullable: false })
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => ArkPlayer, (player) => player.tribe)
  public players: ArkPlayer[];

  @ManyToOne(() => GameServer)
  public server: GameServer;
}
