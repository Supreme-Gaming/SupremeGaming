import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-conan-overview',
  templateUrl: './conan-overview.component.html',
  styleUrls: ['./conan-overview.component.scss'],
})
export class ConanOverviewComponent implements OnInit {
  public servers: Observable<Array<GameServer>>;

  constructor(private ss: ServersService) {}

  public ngOnInit() {
    this.servers = this.ss.getServers('conan');
  }
}
