import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, pluck, shareReplay } from 'rxjs/operators';

import {
  GameServer,
  SupremeGamingEnvironment,
  SupremeGamingEnvironmentGameSettings,
} from '@supremegaming/common/interfaces';
import { GAME_SERVER_STATUS, ServersService } from '@supremegaming/data-access';
import { EnvironmentService } from '@supremegaming/common/ngx';

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

  public baseAssetUrl: Observable<string>;
  public backgroundImageUrl: Observable<string>;

  constructor(private readonly ss: ServersService, private readonly env: EnvironmentService) {}

  ngOnInit(): void {
    this.baseAssetUrl = of(this.env.value<SupremeGamingEnvironment, SupremeGamingEnvironmentGameSettings>('games')).pipe(
      pluck('atlas', 'gridImages'),
      map((base) => {
        return `${base}/images/atlas/grid/0/CellImg_${this.columnIndex}-${this.rowIndex}.jpg`;
      })
    );

    this.backgroundImageUrl = this.baseAssetUrl.pipe(
      map((url) => {
        return `url(${url})`;
      })
    );

    this.status = this.ss.getServerStatus(this.server).pipe(shareReplay());
  }
}
