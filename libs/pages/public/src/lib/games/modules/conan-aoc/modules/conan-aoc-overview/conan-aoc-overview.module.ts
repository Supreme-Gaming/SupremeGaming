import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanAocOverviewComponent } from './conan-aoc-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConanAocOverviewComponent],
})
export class ConanAocOverviewModule {}
