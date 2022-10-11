import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { ArkOmegaComponent } from './ark-omega.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/ark-omega-overview/ark-omega-overview.module').then((m) => m.ArkOmegaOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/ark-omega-rules/ark-omega-rules.module').then((m) => m.ArkOmegaRulesModule),
        data: {
          meta: {
            title: 'Ark Omega Rules',
          },
        },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/ark-omega-settings/ark-omega-settings.module').then((m) => m.ArkOmegaSettingsModule),
        data: {
          meta: {
            title: 'Ark Omega Settings',
          },
        },
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/ark-omega-players-and-tribes/ark-omega-players-and-tribes.module').then(
            (m) => m.ArkOmegaPlayersAndTribesModule
          ),
        data: {
          meta: {
            title: 'Ark Omega Player & Tribe Explorer',
          },
        },
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/ark-omega-mods/ark-omega-mods.module').then((m) => m.ArkOmegaModsModule),
        data: {
          meta: {
            title: 'Ark Omega Mods',
          },
        },
      },
      {
        path: 'plugins',
        loadChildren: () =>
          import('./modules/ark-omega-plugins/ark-omega-plugins.module').then((m) => m.ArkOmegaPluginsModule),
        data: {
          meta: {
            title: 'Ark Omega Plugins',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ArkOmegaComponent],
})
export class ArkOmegaModule {}
