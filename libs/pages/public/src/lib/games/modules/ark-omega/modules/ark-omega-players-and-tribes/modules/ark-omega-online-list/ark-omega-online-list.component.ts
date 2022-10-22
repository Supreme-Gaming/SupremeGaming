import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServersService } from '@supremegaming/data-access';
import { GameServer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-ark-omega-online-list',
  templateUrl: './ark-omega-online-list.component.html',
  styleUrls: ['./ark-omega-online-list.component.scss'],
})
export class ArkOmegaOnlineListComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private readonly ps: ServersService) {}

  public ngOnInit() {
    this.servers = this.ps.getServers('ark-omega');
  }
}
