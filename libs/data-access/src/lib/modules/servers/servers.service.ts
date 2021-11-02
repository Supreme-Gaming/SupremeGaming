import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, timeout, toArray } from 'rxjs/operators';

import {
  GameServer,
  GameServerPlayersResponse,
  GameServerPlayer,
  GameServerStatus,
  SupremeGamingEnvironment,
} from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  private resourceUrl = `${this.env.value<SupremeGamingEnvironment, string>('apiUrl')}/servers`;

  constructor(private env: EnvironmentService, private http: HttpClient) {}

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

  public getServerStatus(server: GameServer): Observable<GAME_SERVER_STATUS> {
    return this.http.get<GameServerStatus>(`${this.resourceUrl}/status/${server.port}`).pipe(
      timeout(7500),
      startWith(GAME_SERVER_STATUS.PENDING),
      switchMap((res) => {
        // First observable value has direct bypass
        if (res === GAME_SERVER_STATUS.PENDING) {
          return of(GAME_SERVER_STATUS.PENDING);
        }

        if (typeof res !== 'string') {
          if (res.success === false) {
            return of(GAME_SERVER_STATUS.OFFLINE);
          } else {
            return of(GAME_SERVER_STATUS.ONLINE);
          }
        }
      }),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          return of(GAME_SERVER_STATUS.BUSY);
        } else {
          return of(GAME_SERVER_STATUS.OFFLINE);
        }
      })
    );
  }

  public getOnlinePlayers(server: GameServer): Observable<Array<GameServerPlayer>> {
    return this.http.get<GameServerPlayersResponse>(`${this.resourceUrl}/online/${server.port}`).pipe(
      timeout(7500),
      map((response) => {
        return response.data;
      })
    );
  }
}

export enum GAME_SERVER_STATUS {
  ONLINE = 'online',
  PENDING = 'pending',
  BUSY = 'busy',
  OFFLINE = 'offline',
}
