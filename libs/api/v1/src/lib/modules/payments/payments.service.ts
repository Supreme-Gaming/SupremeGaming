import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaypalRestService } from '@supremegaming/api/core';
import { DonationEntity } from '@supremegaming/common/entities/v1';

@Injectable()
export class PaymentsService {
  constructor(private readonly pp: PaypalRestService) {}

  public getOrderDetails(id: string) {
    return this.pp.getOrderDetails(id);
  }

  public serializeOrder(id: string): Observable<DonationEntity> {
    return this.getOrderDetails(id).pipe(
      map((order) => {
        const transaction = order.purchase_units[0];

        return {
          Added: Date.now(),
          TimeProcessed: Date.parse(order.create_time) || null,
          PpId: order.id || null,
          ClientId: order.purchase_units[0].payments.captures[0].id || null,
          OrderDetails: JSON.stringify(order) || null,
          Payer: JSON.stringify(order.payer) || null,
          Total: transaction.amount.value || null,
          Processed: 'false',
          // Game:
          //   settings.game_servers.find(
          //     (server) =>
          //       server.port ==
          //       item.transactions[0].item_list.items
          //         .find((o) => {
          //           return o.name.includes('Player Guid');
          //         })
          //         .name.split(':')[1]
          //         .split('-')[1]
          //   ).game || null,
          CharacterName:
            transaction.items
              .find((o) => {
                return o.name.includes('IGN');
              })
              .name.split(':')[1] || null,
          PlayerGuid:
            transaction.items
              .find((o) => {
                return o.name.includes('Player Guid');
              })
              .name.split(':')[1] || null,
          TribeName:
            transaction.items
              .find((o) => {
                return o.name.includes('Tribe Name');
              })
              .name.split(':')[1] || null,
          TribeGuid:
            transaction.items
              .find((o) => {
                return o.name.includes('Tribe Guid');
              })
              .name.split(':')[1] || null,
          Map:
            transaction.items
              .find((o) => {
                return o.name.includes('Map');
              })
              .name.split(':')[1] || null,
        } as DonationEntity;
      })
    );
  }
}
