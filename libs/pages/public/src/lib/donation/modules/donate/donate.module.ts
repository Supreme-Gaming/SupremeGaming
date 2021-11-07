import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DonateComponent } from './donate.component';

const routes: Routes = [
  {
    path: '',
    component: DonateComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DonateComponent],
})
export class DonateModule {}
