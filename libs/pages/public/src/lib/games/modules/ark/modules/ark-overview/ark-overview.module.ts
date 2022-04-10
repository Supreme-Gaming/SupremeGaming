import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { ArkOverviewComponent } from './ark-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [ArkOverviewComponent],
})
export class ArkOverviewModule {}
