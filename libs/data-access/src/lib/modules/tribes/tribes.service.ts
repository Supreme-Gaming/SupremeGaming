import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pluck } from 'rxjs/operators';

import { SupremeGamingEnvironment, GameServerTribesResponse } from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class TribesService {
  private resourceUrl = `${this.env.value<SupremeGamingEnvironment, string>('legacyApiUrl')}/tribes`;

  constructor(private readonly http: HttpClient, private readonly env: EnvironmentService) {}

  public searchTribesForGame(game: string, term: string) {
    const url = this.getQueryEndpointForGame(game);

    return this.http.get<GameServerTribesResponse>(`${url}/${term}`).pipe(pluck('data'));
  }

  /**
   * Returns a prepared URL to query a specific game. The returned URL
   * only needs to have the search term appended to it as another URL segment.
   */
  private getQueryEndpointForGame(game: string) {
    return `${this.resourceUrl}/${game}/q`;
  }
}
