import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShopModule } from '@supremegaming/ui';

import { DonateStatusComponent } from './donate-status.component';

const routes = [
  {
    path: '',
    component: DonateStatusComponent,
  },
  {
    path: ':id',
    component: DonateStatusComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ShopModule],
  declarations: [DonateStatusComponent],
})
export class DonateStatusModule {}
