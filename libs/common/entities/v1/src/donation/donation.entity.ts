import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { IPayPalRestOrder, IPayPalRestPayer } from '@supremegaming/api/core';

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

  @Column({ type: 'json', nullable: true })
  public OrderDetails: IPayPalRestOrder;

  @Column({ type: 'json', nullable: true })
  public Payer: IPayPalRestPayer;

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

  public Summary?: IDonationEntitySummary;

  public totalPointsFromOrder() {
    const sku = this.OrderDetails.purchase_units[0].items.find((item) => item.name.includes('Total Points'));
    const totalPoints = parseInt(sku.name.split(':')[1]);

    return totalPoints;
  }

  public summarize(): IDonationEntitySummarized {
    const copy = DonationEntity.create(this);

    copy.Summary = {
      transactionDate: this.OrderDetails.update_time,
      payerName: this.Payer.name.given_name + ' ' + this.Payer.name.surname,
      payerEmail: this.Payer.email_address,
      totalAmount: this.Total,
      totalPoints: this.totalPointsFromOrder(),
    };

    delete copy.OrderDetails;
    delete copy.Payer;

    return copy;
  }
}

export interface IDonationEntitySummary {
  transactionDate: string;
  payerName: string;
  payerEmail: string;
  totalAmount: string;
  totalPoints: number;
}

export interface IDonationEntitySummarized extends Omit<DonationEntity, 'OrderDetails' | 'Payer'> {
  Summary?: IDonationEntitySummary;
}
