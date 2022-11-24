import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ticket' })
export class TicketEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public ticketId: string;

  @Column({ type: 'bigint' })
  public serverId: number;

  @Column({ type: 'bigint' })
  public serverSequence: number;

  @Column({ type: 'bigint' })
  public createdBy: number;

  @Column({ type: 'bigint' })
  public channelId: number;

  @Column({ default: 'open' })
  public status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public addedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public updatedAt: Date;
}
