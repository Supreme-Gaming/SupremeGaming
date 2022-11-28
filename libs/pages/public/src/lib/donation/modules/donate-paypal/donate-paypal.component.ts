import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ICartItem, IDonationGame, IDonationPackageEvent, ShopService } from '@supremegaming/ui';

@Component({
  selector: 'supremegaming-donate-paypal',
  templateUrl: './donate-paypal.component.html',
  styleUrls: ['./donate-paypal.component.scss'],
})
export class DonatePaypalComponent {
  public selectedGame: Observable<IDonationGame> = this.ss.game;
  public cartItems: Observable<Array<ICartItem>> = this.ss.cart;

  constructor(private readonly ss: ShopService) {}

  public saveGame(game: IDonationGame) {
    this.ss.saveGame(game);
  }

  public savePackage(pkg: IDonationPackageEvent) {
    this.ss.updateCart(pkg);
  }
}
