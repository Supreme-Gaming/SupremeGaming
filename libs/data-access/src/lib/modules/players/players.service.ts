import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { EnvironmentService } from '@supremegaming/common/ngx';
import { GameServerPlayer, GameServerPlayersResponse, SupremeGamingEnvironment } from '@supremegaming/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private resourceUrl = `${this.env.value<SupremeGamingEnvironment, string>('apiUrl')}/players`;

  constructor(private env: EnvironmentService, private http: HttpClient) {}

  public searchPlayersForGame(game: string, term: string): Observable<Array<GameServerPlayer>> {
    const url = this.getQueryEndpointForGame(game);

    return this.http.get<GameServerPlayersResponse>(`${url}/${term}`).pipe(pluck('data'));
  }

  /**
   * Returns a prepared URL to query a specific game. The returned URL
   * only needs to have the search term appended to it as another URL segment.
   */
  public getQueryEndpointForGame(game: string) {
    return `${this.resourceUrl}/${game}/q`;
  }
}
