import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule, UiLayoutModule } from '@supremegaming/ui';

import { CommunityComponent } from './community.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rules',
  },
  {
    path: 'rules',
    component: CommunityComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule, UiLayoutModule],
  declarations: [CommunityComponent],
  exports: [RouterModule],
})
export class CommunityModule {}
