import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ICartItem } from '../../interfaces/shop.interfaces';

@Component({
  selector: 'supremegaming-donation-selections-review',
  templateUrl: './donation-selections-review.component.html',
  styleUrls: ['./donation-selections-review.component.scss'],
})
export class DonationSelectionsReviewComponent implements OnChanges {
  @Input()
  public cart: Array<ICartItem>;

  public cartTotal: CartTotal;

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
}

export interface CartTotal {
  points: number;
  dollars: number;
}
