import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanOverviewComponent } from './conan-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ConanOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConanOverviewComponent],
})
export class ConanOverviewModule {}
