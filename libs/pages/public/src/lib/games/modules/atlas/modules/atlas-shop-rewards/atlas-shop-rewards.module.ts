import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RewardsModule } from '@supremegaming/ui';

import { AtlasShopRewardsComponent } from './atlas-shop-rewards.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasShopRewardsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), RewardsModule],
  declarations: [AtlasShopRewardsComponent],
})
export class AtlasShopRewardsModule {}
