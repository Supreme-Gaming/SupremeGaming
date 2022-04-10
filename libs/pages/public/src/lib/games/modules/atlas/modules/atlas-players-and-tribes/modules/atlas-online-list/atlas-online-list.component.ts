import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-atlas-online-list',
  templateUrl: './atlas-online-list.component.html',
  styleUrls: ['./atlas-online-list.component.scss'],
})
export class AtlasOnlineListComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private readonly ss: ServersService) {}

  public ngOnInit(): void {
    this.servers = this.ss.getServers('atlas');
  }
}
