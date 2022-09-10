import { Entity, Column } from 'typeorm';

import { GuidIdentity } from '@supremegaming/common/entities';

@Entity({ name: 'administration_host_servers' })
export class HostServer extends GuidIdentity {
  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public ip: string;

  @Column({ default: 'register' })
  public status: string;

  @Column({ nullable: false })
  public key: string;
}
