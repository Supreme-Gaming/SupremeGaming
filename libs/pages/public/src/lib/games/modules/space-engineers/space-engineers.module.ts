import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { SpaceEngineersComponent } from './space-engineers.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/space-engineers-overview/space-engineers-overview.module').then(
            (m) => m.SpaceEngineersOverviewModule
          ),
      },
      {
        path: 'rules',
        loadChildren: () =>
          import('./modules/space-engineers-rules/space-engineers-rules.module').then((m) => m.SpaceEngineersRulesModule),
        data: {
          meta: {
            title: 'Space Engineers Rules',
          },
        },
      },
      {
        path: 'faqs',
        loadChildren: () =>
          import('./modules/space-engineers-faqs/space-engineers-faqs.module').then((m) => m.SpaceEngineersFAQsModule),
        data: {
          meta: {
            title: 'Space Engineers FAQs',
          },
        },
      },
      {
        path: 'mods',
        loadChildren: () =>
          import('./modules/space-engineers-mods/space-engineers-mods.module').then((m) => m.SpaceEngineersModsModule),
        data: {
          meta: {
            title: 'Space Engineers Mods',
          },
        },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/space-engineers-settings/space-engineers-settings.module').then(
            (m) => m.SpaceEngineersSettingsModule
          ),
        data: {
          meta: {
            title: 'Space Engineers Settings',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [SpaceEngineersComponent],
})
export class SpaceEngineersModule {}
