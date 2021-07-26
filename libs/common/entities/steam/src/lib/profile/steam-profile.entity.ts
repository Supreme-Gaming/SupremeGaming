import { Entity, Column, PrimaryColumn } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';

@Entity({ name: 'cache_steam_profiles' })
export class SteamProfile extends GuidIdentity {
  @PrimaryColumn()
  public steamId: number;

  @Column()
  public name: string;

  @Column()
  public url: string;

  @Column()
  public avatar: string;

  @Column()
  public communityBanned: boolean;

  @Column()
  public vacBanned: boolean;

  @Column()
  public vacBanCount: number;

  @Column()
  public gameBanCount: number;

  @Column()
  public lastBanned: number;
}
