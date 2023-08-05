import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'donations',
})
export class DonationEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'increment', nullable: false })
  public Id: number;

  @Column({ unique: true, nullable: false, length: 255 })
  public Guid: string;

  @Column({ type: 'bigint', nullable: true })
  public Added: number;

  @CreateDateColumn({ type: 'bigint', nullable: true })
  public TimeProcessed: number;

  @Column({ length: 255, nullable: true })
  public PpId: string;

  @Column({ length: 255, nullable: true })
  public ClientId: string;

  @Column({ type: 'mediumtext', nullable: true })
  public OrderDetails: string;

  @Column({ length: 'mediumtext', nullable: true })
  public Payer: string;

  @Column({ length: 255, nullable: true })
  public Total: string;

  @Column({ length: 255, nullable: true })
  public Processed: string;

  @Column({ length: 255, nullable: true })
  public Game: string;

  @Column({ length: 255, nullable: true })
  public CharacterName: string;

  @Column({ length: 255, nullable: true })
  public PlayerGuid: string;

  @Column({ length: 255, nullable: true })
  public TribeName: string;

  @Column({ length: 255, nullable: true })
  public TribeGuid: string;

  @Column({ length: 255, nullable: true })
  public Map: string;
}
