import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DonateInfoComponent } from './donate-info.component';

const routes: Routes = [
  {
    path: '',
    component: DonateInfoComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DonateInfoComponent],
})
export class DonateInfoModule {}
