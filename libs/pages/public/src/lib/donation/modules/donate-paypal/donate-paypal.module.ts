import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ShopModule } from '@supremegaming/ui';

import { DonatePaypalComponent } from './donate-paypal.component';

const routes: Routes = [
  {
    path: '',
    component: DonatePaypalComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ShopModule],
  declarations: [DonatePaypalComponent],
})
export class DonatePaypalModule {}
