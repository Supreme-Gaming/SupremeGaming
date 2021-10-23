import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { AtlasOverviewComponent } from './atlas-overview.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [AtlasOverviewComponent],
})
export class AtlasOverviewModule {}
