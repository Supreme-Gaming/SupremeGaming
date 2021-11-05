import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RewardsModule } from '@supremegaming/ui';

import { ArkShopRewardsComponent } from './ark-shop-rewards.component';

const routes: Routes = [
  {
    path: '',
    component: ArkShopRewardsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), RewardsModule],
  declarations: [ArkShopRewardsComponent],
})
export class ArkShopRewardsModule {}
