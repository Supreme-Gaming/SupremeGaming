import { Component, Input } from '@angular/core';

import { GameServer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
})
export class ServerListComponent {
  @Input()
  public servers: Array<GameServer>;
}
