import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DonateStatusComponent } from './donate-status.component';

const routes = [
  {
    path: '',
    component: DonateStatusComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DonateStatusComponent],
})
export class DonateStatusModule {}
