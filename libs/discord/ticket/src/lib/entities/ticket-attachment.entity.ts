import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class TicketAttachment {
  @PrimaryGeneratedColumn()
  public id: number;

  @PrimaryColumn({ type: 'bigint' })
  public serverId: string;

  @PrimaryColumn({ type: 'bigint' })
  public messageId: string;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public cdnUrl: string;

  @Column({ type: 'text' })
  public proxyUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public addedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public updatedAt: Date;
}
