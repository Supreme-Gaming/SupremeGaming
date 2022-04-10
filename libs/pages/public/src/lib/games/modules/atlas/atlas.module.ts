import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { AtlasComponent } from './atlas.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/atlas-overview/atlas-overview.module').then((m) => m.AtlasOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/atlas-rules/atlas-rules.module').then((m) => m.AtlasRulesModule),
        data: {
          meta: {
            title: 'Atlas Rules',
          },
        },
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/atlas-settings/atlas-settings.module').then((m) => m.AtlasSettingsModule),
        data: {
          meta: {
            title: 'Atlas Settings',
          },
        },
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/atlas-mods/atlas-mods.module').then((m) => m.AtlasModsModule),
        data: {
          meta: {
            title: 'Atlas Mods',
          },
        },
      },
      {
        path: 'plugins',
        loadChildren: () => import('./modules/atlas-plugins/atlas-plugins.module').then((m) => m.AtlasPluginsModule),
        data: {
          meta: {
            title: 'Atlas Plugins',
          },
        },
      },
      {
        path: 'players-and-companies',
        loadChildren: () =>
          import('./modules/atlas-players-and-tribes/atlas-players-and-tribes.module').then(
            (m) => m.AtlasPlayersAndTribesModule
          ),
        data: {
          meta: {
            title: 'Atlas Pathfinder & Company Explorer',
          },
        },
      },
      {
        path: 'rewards',
        loadChildren: () =>
          import('./modules/atlas-shop-rewards/atlas-shop-rewards.module').then((m) => m.AtlasShopRewardsModule),
        data: {
          meta: {
            title: 'Atlas Shop Rewards',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [AtlasComponent],
})
export class AtlasModule {}
