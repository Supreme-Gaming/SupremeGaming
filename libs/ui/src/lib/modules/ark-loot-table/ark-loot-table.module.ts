import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ArkLootTableComponent } from './components/ark-loot-table/ark-loot-table.component';
import { ArkLootCrateComponent } from './components/ark-loot-crate/ark-loot-crate.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [ArkLootTableComponent, ArkLootCrateComponent],
  exports: [ArkLootTableComponent],
})
export class ArkLootTableModule {}
