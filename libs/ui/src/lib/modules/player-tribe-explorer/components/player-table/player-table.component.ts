import { Component, Input } from '@angular/core';

import { GameServerPlayer } from '@supremegaming/common/interfaces';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  selector: 'supremegaming-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss'],
})
export class PlayerTableComponent extends AbstractResourceTableComponent<GameServerPlayer> {
  @Input()
  public columnsVisible: Array<keyof GameServerPlayer>;
}
