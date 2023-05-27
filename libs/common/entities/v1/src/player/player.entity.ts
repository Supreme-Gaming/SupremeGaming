import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'Players',
})
export class PlayerEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'increment', nullable: false })
  public Id: number;

  @Column({ unique: true, type: 'bigint', nullable: false, default: 0 })
  public SteamId: string;

  @Column({ type: 'varchar', length: '100000', nullable: false, default: '{}' })
  public Kits: string;

  @Column({ default: 0, nullable: true })
  public Points: number;

  @Column({ default: 0, nullable: true })
  public TotalSpent: number;
}
