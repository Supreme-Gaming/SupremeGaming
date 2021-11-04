import { Component, Input, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap, scan } from 'rxjs/operators';

import { GameServer, GameServerPlayer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  selector: 'supremegaming-online-player-list',
  templateUrl: './online-player-list.component.html',
  styleUrls: ['./online-player-list.component.scss'],
})
export class OnlinePlayerListComponent extends AbstractResourceTableComponent<GameServerPlayer> implements OnInit {
  @Input()
  public servers: Array<GameServer>;

  public players: Observable<Array<GameServerPlayer>>;

  constructor(private readonly ss: ServersService) {
    super();
  }

  public ngOnInit() {
    this.players = from(this.servers).pipe(
      mergeMap((server) => {
        return this.ss.getOnlinePlayers(server);
      }),
      scan((acc, curr) => {
        return [...acc, ...curr];
      }, [])
    );
  }
}
