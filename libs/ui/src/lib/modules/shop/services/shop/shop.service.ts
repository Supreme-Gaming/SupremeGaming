import { Injectable } from '@angular/core';
import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { ICartItem, IDonationGame, IDonationPackageEvent } from '../../interfaces/shop.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private _game: ReplaySubject<IDonationGame> = new ReplaySubject<IDonationGame>(1);
  private _cart: BehaviorSubject<Array<ICartItem>> = new BehaviorSubject<Array<ICartItem>>([]);
  private _recipient: ReplaySubject<GameServerPlayer> = new ReplaySubject<GameServerPlayer>();

  public cart: Observable<Array<ICartItem>> = this._cart.asObservable();
  public game: Observable<IDonationGame> = this._game.asObservable();
  public recipient: Observable<GameServerPlayer> = this._recipient.asObservable();

  public saveGame(game: IDonationGame) {
    this._game.next(game);
  }

  public updateCart(event: IDonationPackageEvent) {
    const currentCart = [...JSON.parse(JSON.stringify(this._cart.getValue()))];

    if (event.type === 'add') {
      const existingItem = currentCart.find((cartItem) => cartItem.sku === event.pkg.sku);

      if (existingItem) {
        existingItem.count++;
      } else {
        currentCart.push({ ...event.pkg, count: 1 });
      }
    } else {
      const existingItem = currentCart.find((cartItem) => cartItem.sku === event.pkg.sku);

      if (existingItem) {
        existingItem.count--;

        if (existingItem.count === 0) {
          const index = currentCart.indexOf(existingItem);
          currentCart.splice(index, 1);
        }
      }
    }

    this._cart.next(currentCart);
  }

  public saveRecipient(recipient: GameServerPlayer) {
    this._recipient.next(recipient);
  }

  public clearCart() {
    this._cart.next([]);
  }
}
