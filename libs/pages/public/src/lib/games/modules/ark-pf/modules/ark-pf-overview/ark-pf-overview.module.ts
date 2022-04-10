import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { ArkPfOverviewComponent } from './ark-pf-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [ArkPfOverviewComponent],
})
export class ArkPfOverviewModule {}
