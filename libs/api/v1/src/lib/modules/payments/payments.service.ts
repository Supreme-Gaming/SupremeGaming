import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, of, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { PaypalRestService, LoggerService, IPayPalRestOrder } from '@supremegaming/api/core';
import {
  DonationEntity,
  EVENT_PERFORMED_BY,
  EVENT_TYPE,
  EventEntity,
  PlayerEntity,
} from '@supremegaming/common/entities/v1';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(DonationEntity) private readonly donationRepo: Repository<DonationEntity>,
    @InjectRepository(EventEntity) private readonly eventRepo: Repository<EventEntity>,
    @InjectRepository(PlayerEntity, 'rewards') private readonly playerRepo: Repository<PlayerEntity>,
    private readonly ls: LoggerService,
    private readonly pp: PaypalRestService
  ) {}

  public getOrderDetails(id: string) {
    return this.serializeOrder(id).pipe(this.getDisbursementStatus());
  }

  private serializeOrder(id: string): Observable<DonationEntity> {
    return this.pp.getOrderDetails(id).pipe(
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

  private getDisbursementStatus() {
    return pipe(
      switchMap((order: DonationEntity) => {
        return from(this.donationRepo.findOne({ where: { PpId: order.PpId } })).pipe(
          switchMap((donation) => {
            // Donation will either be null or an object
            if (donation) {
              return of(donation).pipe(tap((donation) => this._disburseDonation(donation)));
            } else {
              return from(this.donationRepo.save(order)).pipe(
                tap((o) => {
                  this._disburseDonation(o);
                })
              );
            }
          })
        );
      })
    );
  }

  private async _disburseDonation(donation: DonationEntity) {
    // If the donation has already been processed, don't do anything
    if (donation.Processed == 'true') {
      this.ls.debug(`Donation ${donation.Id} has already been processed`);
      return;
    }

    this.ls.debug(`Disbursing donation ${donation.Id}`);

    // PlayerGuid is a hyphenated id that has steam id and and map id. We need only the steam id
    const [steamId] = donation.PlayerGuid.split('-');

    // Get the player and parse the order details to get the total points
    // Can't convert a dollar amount to points because ratios are not static (e.g. promotions, etc)
    const player = await this.playerRepo.findOne({ where: { SteamId: steamId } });
    const pointTotalToAdd = this.getTotalPointsFromOrder(JSON.parse(donation.OrderDetails));

    if (player && pointTotalToAdd > 0) {
      const oldPoints = player.Points;
      this.ls.debug(`Adding ${pointTotalToAdd} points to player ${player.SteamId}`);
      player.Points += pointTotalToAdd;

      try {
        this.playerRepo.save(player);

        const event = new EventEntity();
        event.type = EVENT_TYPE.DISBURSEMENT;
        event.performedBy = EVENT_PERFORMED_BY.SYSTEM;
        event.ref = donation.Id.toString();
        event.details = JSON.stringify({
          oldPoints,
          newPoints: player.Points,
        });

        event.save();

        donation.Processed = 'true';
        this.donationRepo.save(donation);
      } catch (err) {
        this.ls.error('Error disbursing donation to player.');
      }
    } else {
      this.ls.error(`Player not found for donation disbursement, ${steamId}`);
    }
  }

  private getTotalPointsFromOrder(order: IPayPalRestOrder) {
    const sku = order.purchase_units[0].items.find((item) => item.name.includes('Total Points'));
    const totalPoints = parseInt(sku.name.split(':')[1]);

    return totalPoints;
  }
}
