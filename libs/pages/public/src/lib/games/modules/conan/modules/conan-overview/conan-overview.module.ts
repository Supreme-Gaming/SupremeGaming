import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { ConanOverviewComponent } from './conan-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ConanOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [ConanOverviewComponent],
})
export class ConanOverviewModule {}
