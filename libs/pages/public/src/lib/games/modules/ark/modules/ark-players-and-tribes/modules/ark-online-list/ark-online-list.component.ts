import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { filter, switchMap, toArray } from 'rxjs/operators';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-online-list',
  templateUrl: './ark-online-list.component.html',
  styleUrls: ['./ark-online-list.component.scss'],
})
export class ArkOnlineListComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private readonly ps: ServersService) {}

  public ngOnInit() {
    this.servers = this.ps.getServers('ark').pipe(
      switchMap((s) => from(s)),
      filter((server) => server.map_name.includes('PF') === false),
      toArray()
    );
  }
}
