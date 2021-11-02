import { Component, Input } from '@angular/core';

import { GameServerPlayer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss'],
})
export class PlayerTableComponent {
  @Input()
  public players: Array<GameServerPlayer>;

  @Input()
  public columnsVisible: Array<keyof GameServerPlayer>;

  @Input()
  public columnLabels: Array<string>;

  @Input()
  public showCount = true;
}
