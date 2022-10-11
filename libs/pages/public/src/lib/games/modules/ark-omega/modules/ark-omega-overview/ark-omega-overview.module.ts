import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServersModule } from '@supremegaming/ui';

import { ArkOmegaOverviewComponent } from './ark-omega-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ServersModule],
  declarations: [ArkOmegaOverviewComponent],
})
export class ArkOmegaOverviewModule {}
