import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkLootTableModule } from '@supremegaming/ui';

import { ArkSupplyDropsComponent } from './ark-supply-drops.component';

const routes: Routes = [
  {
    path: '',
    component: ArkSupplyDropsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ArkLootTableModule],
  declarations: [ArkSupplyDropsComponent],
})
export class ArkSupplyDropsModule {}
