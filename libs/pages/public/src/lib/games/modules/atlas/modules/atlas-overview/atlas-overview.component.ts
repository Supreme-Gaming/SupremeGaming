import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ServersService } from '@supremegaming/data-access';
import { GameServer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-atlas-overview',
  templateUrl: './atlas-overview.component.html',
  styleUrls: ['./atlas-overview.component.scss'],
})
export class AtlasOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('atlas').pipe(shareReplay(1));
  }
}
