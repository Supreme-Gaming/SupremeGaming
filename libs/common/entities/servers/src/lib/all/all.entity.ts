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
}
