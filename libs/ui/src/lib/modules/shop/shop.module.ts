import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UIFormsModule } from '../forms/forms.module';

import { DonationMethodSelectionComponent } from './components/donation-method-selection/donation-method-selection.component';

@NgModule({
  imports: [CommonModule, UIFormsModule, RouterModule],
  declarations: [DonationMethodSelectionComponent],
  exports: [DonationMethodSelectionComponent],
})
export class ShopModule {}
