import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { ArkComponent } from './ark.component';

const routes: Routes = [
  {
    path: '',
    component: ArkComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/ark-overview/ark-overview.module').then((m) => m.ArkOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/ark-rules/ark-rules.module').then((m) => m.ArkRulesModule),
        data: {
          meta: {
            title: 'Ark Rules',
          },
        },
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/ark-settings/ark-settings.module').then((m) => m.ArkSettingsModule),
        data: {
          meta: {
            title: 'Ark Settings',
          },
        },
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/ark-players-and-tribes/ark-players-and-tribes.module').then((m) => m.ArkPlayersAndTribesModule),
        data: {
          meta: {
            title: 'Ark Player & Tribe Explorer',
          },
        },
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/ark-mods/ark-mods.module').then((m) => m.ArkModsModule),
        data: {
          meta: {
            title: 'Ark Mods',
          },
        },
      },
      {
        path: 'plugins',
        loadChildren: () => import('./modules/ark-plugins/ark-plugins.module').then((m) => m.ArkPluginsModule),
        data: {
          meta: {
            title: 'Ark Plugins',
          },
        },
      },
      {
        path: 'supply-drops',
        loadChildren: () => import('./modules/ark-supply-drops/ark-supply-drops.module').then((m) => m.ArkSupplyDropsModule),
        data: {
          meta: {
            title: 'Ark Custom Supply Drop Table',
          },
        },
      },
      {
        path: 'rewards',
        loadChildren: () => import('./modules/ark-shop-rewards/ark-shop-rewards.module').then((m) => m.ArkShopRewardsModule),
        data: {
          meta: {
            title: 'Ark Shop Rewards',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ArkComponent],
})
export class ArkModule {}
