import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ticket_message' })
export class TicketMessageEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @PrimaryColumn({ type: 'bigint' })
  public serverId: number;

  @Column()
  public ticketId: string;

  @Column({ type: 'bigint' })
  public createdBy: number;

  @Column()
  public authorName: string;

  @PrimaryColumn({ type: 'bigint' })
  public messageId: number;

  @Column({ type: 'text' })
  public content: string;

  @Column({ default: false })
  public edited: boolean;

  @Column({ default: false })
  public deleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public addedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public updatedAt: Date;
}
