import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-omega-overview',
  templateUrl: './ark-omega-overview.component.html',
  styleUrls: ['./ark-omega-overview.component.scss'],
})
export class ArkOmegaOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('ark-omega');
  }
}
