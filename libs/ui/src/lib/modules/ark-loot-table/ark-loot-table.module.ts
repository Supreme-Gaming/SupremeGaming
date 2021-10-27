import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArkLootTableComponent } from './components/ark-loot-table/ark-loot-table.component';

@NgModule({
  declarations: [ArkLootTableComponent],
  imports: [CommonModule],
  exports: [ArkLootTableComponent],
})
export class ArkLootTableModule {}
