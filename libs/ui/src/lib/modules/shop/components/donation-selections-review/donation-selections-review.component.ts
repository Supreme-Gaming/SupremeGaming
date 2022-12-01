import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { loadScript, PayPalNamespace, PurchaseItem } from '@paypal/paypal-js';

import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';

import { ICartItem } from '../../interfaces/shop.interfaces';

@Component({
  selector: 'supremegaming-donation-selections-review',
  templateUrl: './donation-selections-review.component.html',
  styleUrls: ['./donation-selections-review.component.scss'],
})
export class DonationSelectionsReviewComponent implements OnInit, OnChanges {
  @Input()
  public cart: Array<ICartItem>;

  @Input()
  public recipient: GameServerPlayer;

  @ViewChild('PayPalButtonContainer', { static: true })
  private _ppElement: ElementRef;

  public cartTotal: CartTotal;

  private _pp: PayPalNamespace;
  private _isProd: boolean;

  constructor(private readonly env: EnvironmentService, private readonly router: Router) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.cart && (changes.cart.currentValue as Array<ICartItem>).length > 0) {
      this.cartTotal = this.cart.reduce(
        (acc, item) => {
          acc.points += item.points * item.count;
          acc.dollars += item.price * item.count;

          return acc;
        },
        { points: 0, dollars: 0 }
      );
    }
  }

  public ngOnInit(): void {
    this.initPP();

    this._isProd = this.env.value('production', true);
  }

  public async initPP() {
    this._pp = await loadScript({
      'client-id': 'sb',
      currency: 'USD',
      intent: 'capture',
      components: 'buttons',
      'disable-funding': 'paylater',
      'enable-funding': 'card',
    });

    const button = this._pp.Buttons({
      style: {
        color: 'silver',
        shape: 'pill',
        layout: 'horizontal',
        label: 'checkout',
        height: 40,
      },
      createOrder: (data, actions) => {
        const invoiceCartItems: PurchaseItem[] = this.cart.map((cartItem) => {
          return {
            name: cartItem.name,
            quantity: cartItem.count.toString(),
            unit_amount: {
              value: cartItem.price.toString(),
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: cartItem.sku.toString(),
            description: `${cartItem.points} Points`,
          };
        });

        const staticCartItems: PurchaseItem[] = [
          {
            name: `Total Points: ${this.cartTotal.points}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '99',
          },
          {
            name: `Map:${this.recipient.PlayMap}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '-4',
          },
          {
            name: `Tribe Name:${this.recipient.TribeName}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '-3',
          },
          {
            name: `Tribe Guid:${this.recipient.TribeGuid}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '-2',
          },
          {
            name: `Player Guid:${this.recipient.Guid}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '-1',
          },
          {
            name: `IGN:${this.recipient.CharacterName}`,
            quantity: '1',
            unit_amount: {
              value: '0',
              currency_code: 'USD',
            },
            category: 'DIGITAL_GOODS',
            sku: '99',
          },
        ];

        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this.cartTotal.dollars.toString(),
                breakdown: {
                  item_total: {
                    value: this.cartTotal.dollars.toString(),
                    currency_code: 'USD',
                  },
                },
              },
              items: [...invoiceCartItems, ...staticCartItems],
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();

        if (this._isProd === false) {
          console.log('order', order);
        }

        this.router.navigate(['/donate/status', order.id]);
      },
      onError: (err) => {
        if (this._isProd == false) {
          console.error(err);
        }
      },
    });

    button.render(this._ppElement.nativeElement);
  }
}

export interface CartTotal {
  points: number;
  dollars: number;
}
