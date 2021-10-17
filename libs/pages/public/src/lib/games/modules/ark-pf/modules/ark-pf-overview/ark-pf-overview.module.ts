import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfOverviewComponent } from './ark-pf-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ArkPfOverviewModule {}
