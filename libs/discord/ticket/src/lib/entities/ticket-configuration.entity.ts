import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TicketConfiguration {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'bigint' })
  public serverId: string;

  @Column({ type: 'json' })
  public config: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public addedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public updatedAt: Date;
}
