import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { filter, switchMap, toArray } from 'rxjs/operators';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-pf-overview',
  templateUrl: './ark-pf-overview.component.html',
  styleUrls: ['./ark-pf-overview.component.scss'],
})
export class ArkPfOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('ark-pf');
  }
}
