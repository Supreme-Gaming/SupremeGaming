import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ArkSupplyDropTable } from '@supremegaming/common/interfaces';
import { ArkSupplyDropsService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-loot-table',
  templateUrl: './ark-loot-table.component.html',
  styleUrls: ['./ark-loot-table.component.scss'],
})
export class ArkLootTableComponent implements OnInit {
  public drops: Observable<ArkSupplyDropTable>;

  constructor(private ls: ArkSupplyDropsService) {}

  ngOnInit(): void {
    this.drops = this.ls.getSupplyDropTable();
  }
}
