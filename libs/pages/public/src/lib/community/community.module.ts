import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule, UiLayoutModule } from '@supremegaming/ui';

import { CommunityComponent } from './community.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityComponent,
    children: [
      {
        path: '',
        redirectTo: 'rules',
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/community-rules/community-rules.module').then((m) => m.CommunityRulesModule),
        data: {
          meta: {
            title: 'Community Rules',
          },
        },
      },
      {
        path: 'support',
        loadChildren: () =>
          import('./modules/community-support/community-support.module').then((m) => m.CommunitySupportModule),
        data: {
          meta: {
            title: 'Community Support',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule, UiLayoutModule],
  declarations: [CommunityComponent],
  exports: [RouterModule],
})
export class CommunityModule {}
