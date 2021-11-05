import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RewardsListComponent } from './components/rewards-list/rewards-list.component';
import { InteractionsModule } from '../interactions/interactions.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, InteractionsModule],
  declarations: [RewardsListComponent],
  exports: [RewardsListComponent],
})
export class RewardsModule {}
