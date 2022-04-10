import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-overview',
  templateUrl: './ark-overview.component.html',
  styleUrls: ['./ark-overview.component.scss'],
})
export class ArkOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('ark');
  }
}
