import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'events' })
export class EventEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'uuid', nullable: false })
  public guid: string;

  @CreateDateColumn({ nullable: false })
  public created: Date;

  @UpdateDateColumn({ nullable: false })
  public updated: Date;

  @Column({ length: 255, nullable: true })
  public type: string;

  @Column({ length: 255, nullable: true })
  public performedBy: string;
}
