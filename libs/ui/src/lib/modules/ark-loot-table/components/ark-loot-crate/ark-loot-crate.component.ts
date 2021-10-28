import { Component, Input } from '@angular/core';

import { SimplifiedArkSupplyDropTableCrate } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-ark-loot-crate',
  templateUrl: './ark-loot-crate.component.html',
  styleUrls: ['./ark-loot-crate.component.scss'],
})
export class ArkLootCrateComponent {
  @Input()
  public crate: SimplifiedArkSupplyDropTableCrate;
}
