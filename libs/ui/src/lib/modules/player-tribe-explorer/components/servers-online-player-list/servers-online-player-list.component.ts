import { Component, Input, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap, scan } from 'rxjs/operators';

import { GameServer, GameServerPlayer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-servers-online-player-list',
  templateUrl: './servers-online-player-list.component.html',
  styleUrls: ['./servers-online-player-list.component.scss'],
})
export class ServersOnlinePlayerListComponent implements OnInit {
  @Input()
  public servers: Array<GameServer>;

  public players: Observable<Array<GameServerPlayer>>;

  constructor(private readonly ss: ServersService) {}

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
