import { Component, Input, OnInit } from '@angular/core';
import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { from, Observable } from 'rxjs';
import { filter, map, pluck, shareReplay, switchMap, toArray, withLatestFrom } from 'rxjs/operators';

import { PlayersService } from '@supremegaming/data-access';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  selector: 'supremegaming-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
})
export class PlayerDetailsComponent extends AbstractResourceTableComponent<GameServerPlayer> implements OnInit {
  @Input()
  public playerGuid: Observable<string>;

  @Input()
  public game: string;

  public player: Observable<GameServerPlayer>;
  public entities: Observable<Array<GameServerPlayer>>;

  constructor(private readonly ps: PlayersService) {
    super();
  }

  public ngOnInit(): void {
    this.player = this.playerGuid.pipe(
      switchMap((guid) => {
        return this.ps.searchPlayersForGame(this.game, guid).pipe(pluck<GameServerPlayer[], GameServerPlayer>('0'));
      }),
      shareReplay()
    );

    this.entities = this.player.pipe(
      switchMap((pl) => {
        // Filtering of the players needs to happen off the http stream because
        // this.player is a long-lived observable and does not emit
        return this.ps.searchPlayersForGame(this.game, pl.SteamId, true).pipe(
          switchMap((players) => {
            return from(players);
          }),
          withLatestFrom(this.playerGuid),
          filter(([player, guid]) => {
            return player.Guid !== guid;
          }),
          map(([player, guid]) => player),
          toArray()
        );
      }),
      shareReplay()
    );
  }
}
