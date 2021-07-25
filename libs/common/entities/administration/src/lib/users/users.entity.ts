import { Entity, Column } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';

@Entity({ name: 'users' })
export class Users extends GuidIdentity {

  @Column()
  public email: string;

  @Column()
  public username: string;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column()
  public permissions: string;
  
  @Column()
  public active: boolean;

  @Column()
  public lastip: string;

  @Column()
  public steamid: string;
}