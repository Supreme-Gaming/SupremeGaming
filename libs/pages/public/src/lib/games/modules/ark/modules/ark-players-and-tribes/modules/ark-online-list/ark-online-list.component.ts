import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    this.servers = this.ps.getServers('ark');
  }
}
