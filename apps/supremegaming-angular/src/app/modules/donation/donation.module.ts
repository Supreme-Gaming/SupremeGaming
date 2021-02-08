import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FrameModule } from '../frame/frame.module';

import { DonationComponent } from './donation.component';

const routes: Routes = [
  {
    path: '',
    component: DonationComponent,
  },
  {
    path: 'shop',
    component: DonationComponent,
  },
  {
    path: 'rewards',
    component: DonationComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule],
  declarations: [DonationComponent],
  exports: [RouterModule],
})
export class DonationModule {}
