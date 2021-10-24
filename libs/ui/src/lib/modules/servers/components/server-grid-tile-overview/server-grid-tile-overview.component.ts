import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { GameServer } from '@supremegaming/common/interfaces';
import { GAME_SERVER_STATUS, ServersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-server-grid-tile-overview',
  templateUrl: './server-grid-tile-overview.component.html',
  styleUrls: ['./server-grid-tile-overview.component.scss'],
})
export class ServerGridTileOverviewComponent implements OnInit {
  @Input()
  public server: GameServer;

  @Input()
  public columnIndex: number;

  @Input()
  public rowIndex: number;

  public status: Observable<GAME_SERVER_STATUS>;

  constructor(private readonly ss: ServersService) {}

  ngOnInit(): void {
    this.status = this.ss.getServerStatus(this.server).pipe(shareReplay());
  }
}
