import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServersService } from '@supremegaming/data-access';
import { GameServer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-ark-pf-online-list',
  templateUrl: './ark-pf-online-list.component.html',
  styleUrls: ['./ark-pf-online-list.component.scss'],
})
export class ArkPfOnlineListComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private readonly ps: ServersService) {}

  public ngOnInit() {
    this.servers = this.ps.getServers('ark-pf');
  }
}
