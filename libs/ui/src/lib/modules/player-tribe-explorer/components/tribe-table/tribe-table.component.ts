import { Component, Input } from '@angular/core';

import { GameServerTribe } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-tribe-table',
  templateUrl: './tribe-table.component.html',
  styleUrls: ['./tribe-table.component.scss'],
})
export class TribeTableComponent {
  @Input()
  public tribes: Array<GameServerTribe>;

  @Input()
  public columnsVisible: Array<keyof GameServerTribe | 'MemberCount'>;

  @Input()
  public columnLabels: Array<string>;

  @Input()
  public showCount = true;
}
