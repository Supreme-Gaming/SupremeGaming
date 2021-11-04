import { Component, Input } from '@angular/core';

import { GameServerTribe } from '@supremegaming/common/interfaces';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  selector: 'supremegaming-tribe-table',
  templateUrl: './tribe-table.component.html',
  styleUrls: ['./tribe-table.component.scss'],
})
export class TribeTableComponent extends AbstractResourceTableComponent<GameServerTribe> {}
