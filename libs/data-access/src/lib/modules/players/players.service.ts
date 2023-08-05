import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { EnvironmentService } from '@supremegaming/common/ngx';
import { GameServerPlayer, GameServerPlayersResponse, SupremeGamingEnvironment } from '@supremegaming/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private resourceUrl = `${this.env.value<SupremeGamingEnvironment, string>('legacyApiUrl')}/players`;

  constructor(private env: EnvironmentService, private http: HttpClient) {}

  public searchPlayersForGame(game: string, term: string, sortByLastOnline?: boolean): Observable<Array<GameServerPlayer>> {
    const url = this.getQueryEndpointForGame(game);

    return this.http.get<GameServerPlayersResponse>(`${url}/${term}`).pipe(
      pluck('data'),
      map((players) => {
        if (sortByLastOnline) {
          return players.sort((a, b) => {
            return b.FileUpdated - a.FileUpdated;
          });
        } else {
          return players;
        }
      })
    );
  }

  /**
   * Returns a prepared URL to query a specific game. The returned URL
   * only needs to have the search term appended to it as another URL segment.
   */
  private getQueryEndpointForGame(game: string) {
    return `${this.resourceUrl}/${game}/q`;
  }
}
