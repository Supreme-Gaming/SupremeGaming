import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { filter, switchMap, toArray } from 'rxjs/operators';

import { GameServer, SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  constructor(private env: EnvironmentService) {}

  /**
   * Return a list of servers by game, if provided, or a full list of available servers if game is
   * is not provided.
   *
   * TODO: This currently returns from a static list. This will eventually make an API call.
   */
  public getServers(game?: string): Observable<Array<GameServer>> {
    if (game === undefined) {
      return of(this.env.value<SupremeGamingEnvironment, Array<GameServer>>('servers'));
    } else {
      return of(this.env.value<SupremeGamingEnvironment, Array<GameServer>>('servers')).pipe(
        switchMap((servers) => {
          return from(servers);
        }),
        filter((server) => {
          return server.game === game;
        }),
        toArray()
      );
    }
  }
}
