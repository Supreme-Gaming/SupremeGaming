import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'events' })
export class EventEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'uuid', nullable: false })
  public guid: string;

  @CreateDateColumn({ nullable: false })
  public created?: Date;

  @UpdateDateColumn({ nullable: false })
  public updated?: Date;

  @Column({ length: 255, nullable: false })
  public type: EVENT_TYPE;

  @Column({ length: 255, nullable: false })
  public performedBy: EVENT_PERFORMED_BY;

  @Column({ type: 'mediumtext', nullable: false })
  public details: string;

  @Column({ length: 255, nullable: false })
  public ref: string;
}

export enum EVENT_TYPE {
  DISBURSEMENT = 'disbursement',
}

export enum EVENT_PERFORMED_BY {
  SYSTEM = 'system',
  PLAYER = 'player',
}
