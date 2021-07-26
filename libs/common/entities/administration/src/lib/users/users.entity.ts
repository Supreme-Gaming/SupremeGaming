import { Entity, Column } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';

@Entity({ name: 'administration_users' })
export class User extends GuidIdentity {
  @Column({ nullable: true })
  public email: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public firstname: string;

  @Column({ nullable: true })
  public lastname: string;

  @Column({ nullable: true })
  public permissions: string;

  @Column({ default: true })
  public active: boolean;

  @Column({ nullable: true })
  public lastip: string;

  @Column()
  public steamid: string;
}
