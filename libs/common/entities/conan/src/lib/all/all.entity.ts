import { Entity, Column, PrimaryColumn } from 'typeorm';

import { TimeStampEntity } from '@supremegaming/common/entities';

@Entity({ name: 'players' })
export class Player extends TimeStampEntity {
  @Column()
  public Id: number;

  @Column()
  public Guid: string;

  @Column()
  public CharacterName: string;

  @Column()
  public SteamId: string;

  @Column()
  public TribeId: number;

  @Column()
  public TribeGuid: string;

  @Column()
  public PlayMap: string;

  @Column()
  public Host: number;

  @Column()
  public DataPort: number;
}

@Entity({ name: 'characters' })
export class LitePlayer {
  @PrimaryColumn()
  public playerId: number;

  @Column()
  public Id: number;

  @Column()
  public char_name: string;

  @Column()
  public level: number;

  @Column()
  public rank: number;

  @Column()
  public guild: number;

  @Column()
  public isAlive: boolean;

  @Column()
  public killerName: string;

  @Column()
  public lastTimeOnline: Date;
}

@Entity({ name: 'tribes' })
export class Tribe extends TimeStampEntity {
  @Column()
  public Id: number;

  @Column()
  public Guid: string;

  @Column()
  public Name: string;

  @Column()
  public OwnerId: number;

  @Column()
  public PlayMap: string;

  @Column()
  public Host: number;

  @Column()
  public DataPort: number;
}

@Entity({ name: 'guids' })
export class LiteTribe {
  @PrimaryColumn()
  public guildId: number;

  @Column()
  public name: string;

  @Column()
  public messageOfTheDay: string;

  @Column()
  public owner: number;

  @Column()
  public nameLastChangedBy: number;

  @Column()
  public motdLastChangedBy: string;

  @Column()
  public rescueCooldown: number;
}
