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
            title: 'Supreme Gaming Global Community Rules',
            description:
              'Community rule set to enable and a welcoming and comfortable place to hang out and make new friends.',
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
            description:
              'Have a question or a problem? Learn how to ask for help and join our Discord server, the best place to communicate with community and staff members.',
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
