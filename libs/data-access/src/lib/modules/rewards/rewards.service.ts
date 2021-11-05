import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BaseRewardSet,
  Game,
  ShopRewards,
  SourceShopRewards,
  SupremeGamingEnvironment,
} from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  private games = this.env.value<SupremeGamingEnvironment, SupremeGamingEnvironment['games']>('games');

  constructor(private env: EnvironmentService, private http: HttpClient) {}

  public getRewardsForGame(game: Game): Observable<ShopRewards> {
    return this.http.get<SourceShopRewards>(`${this.games[game].rewardsUrl}`).pipe(
      map((source) => {
        const Kits = this.dictionaryToArray(source.Kits);
        const ShopItems = this.dictionaryToArray(source.ShopItems);

        return { Kits, ShopItems };
      })
    );
  }

  /**
   * Converts a dictionary of either source shop reward kits/items into an array of reward kits/items.
   *
   * Maps the dictionary key into the returned items to make it available for use (to show spawn code).
   */
  private dictionaryToArray<T extends BaseRewardSet>(group: { [key: string]: T }): Array<T> {
    return Object.entries(group).reduce((acc, [key, value]) => {
      value.SpawnCode = key;

      return [...acc, value];
    }, []);
  }
}
