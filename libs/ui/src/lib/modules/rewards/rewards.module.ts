import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardsListComponent } from './components/rewards-list/rewards-list.component';
import { InteractionsModule } from '../interactions/interactions.module';

@NgModule({
  imports: [CommonModule, InteractionsModule],
  declarations: [RewardsListComponent],
  exports: [RewardsListComponent],
})
export class RewardsModule {}
