import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-space-engineers-overview',
  templateUrl: './space-engineers-overview.component.html',
  styleUrls: ['./space-engineers-overview.component.scss'],
})
export class SpaceEngineersOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('space-engineers');
  }
}
