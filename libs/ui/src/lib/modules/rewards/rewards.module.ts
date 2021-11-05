import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardsListComponent } from './components/rewards-list/rewards-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RewardsListComponent],
  exports: [RewardsListComponent],
})
export class RewardsModule {}
