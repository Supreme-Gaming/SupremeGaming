import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'donations',
})
export class DonationEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'increment' })
  public Id: number;

  @Column({ generated: 'uuid', nullable: false, length: 255 })
  public Guid: string;

  @Column({ type: 'bigint', nullable: true })
  public Added: number;

  @Column({ type: 'bigint', nullable: true })
  public TimeProcessed: number;

  @Column({ length: 255, nullable: true })
  public PpId: string;

  @Column({ length: 255, nullable: true })
  public ClientId: string;

  @Column({ type: 'mediumtext', nullable: true })
  public OrderDetails: string;

  @Column({ type: 'mediumtext', nullable: true })
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
