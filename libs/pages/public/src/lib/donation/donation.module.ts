import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { DonationComponent } from './donation.component';

const routes: Routes = [
  {
    path: '',
    component: DonationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/donate/donate.module').then((m) => m.DonateModule),
      },
      {
        path: 'info',
        loadChildren: () => import('./modules/donate-info/donate-info.module').then((m) => m.DonateInfoModule),
      },
      {
        path: 'one-time',
        loadChildren: () => import('./modules/donate-paypal/donate-paypal.module').then((m) => m.DonatePaypalModule),
        data: {
          meta: {
            title: 'One Time Donation',
          },
        },
      },
      {
        path: 'status',
        loadChildren: () => import('./modules/donate-status/donate-status.module').then((m) => m.DonateStatusModule),
        data: {
          meta: {
            title: 'Donation Status',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [DonationComponent],
  exports: [RouterModule],
})
export class DonationModule {}
