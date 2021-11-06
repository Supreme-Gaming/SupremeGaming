import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { ArkPfComponent } from './ark-pf.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/ark-pf-overview/ark-pf-overview.module').then((m) => m.ArkPfOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/ark-pf-rules/ark-pf-rules.module').then((m) => m.ArkPfRulesModule),
        data: {
          meta: {
            title: 'Ark PF Rules',
          },
        },
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/ark-pf-settings/ark-pf-settings.module').then((m) => m.ArkPfSettingsModule),
        data: {
          meta: {
            title: 'Ark PF Settings',
          },
        },
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/ark-pf-players-and-tribes/ark-pf-players-and-tribes.module').then(
            (m) => m.ArkPfPlayersAndTribesModule
          ),
        data: {
          meta: {
            title: 'Ark PF Player & Tribe Explorer',
          },
        },
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/ark-pf-mods/ark-pf-mods.module').then((m) => m.ArkPfModsModule),
        data: {
          meta: {
            title: 'Ark PF Mods',
          },
        },
      },
      {
        path: 'plugins',
        loadChildren: () => import('./modules/ark-pf-plugins/ark-pf-plugins.module').then((m) => m.ArkPfPluginsModule),
        data: {
          meta: {
            title: 'Ark PF Plugins',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ArkPfComponent],
})
export class ArkPfModule {}
