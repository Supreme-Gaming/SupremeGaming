import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { filter, switchMap, toArray } from 'rxjs/operators';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-players-and-tribes',
  templateUrl: './ark-players-and-tribes.component.html',
  styleUrls: ['./ark-players-and-tribes.component.scss'],
})
export class ArkPlayersAndTribesComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private readonly ps: ServersService) {}

  public ngOnInit() {
    this.servers = this.ps.getServers('ark').pipe(
      switchMap((s) => from(s)),
      filter((server) => server.game.includes('PF') === false),
      toArray()
    );
  }
}
