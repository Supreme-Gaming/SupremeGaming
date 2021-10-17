import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkSupplyDropsComponent } from './ark-supply-drops.component';

const routes: Routes = [
  {
    path: '',
    component: ArkSupplyDropsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ArkSupplyDropsModule {}
