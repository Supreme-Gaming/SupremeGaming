import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { SpaceEngineersOverviewComponent } from './space-engineers-overview.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [SpaceEngineersOverviewComponent],
})
export class SpaceEngineersOverviewModule {}
