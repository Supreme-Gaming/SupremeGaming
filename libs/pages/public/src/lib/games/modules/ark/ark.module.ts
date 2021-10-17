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
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/ark-players-and-tribes/ark-players-and-tribes.module').then((m) => m.ArkPlayersAndTribesModule),
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/ark-mods/ark-mods.module').then((m) => m.ArkModsModule),
      },
      {
        path: 'plugins',
        loadChildren: () => import('./modules/ark-plugins/ark-plugins.module').then((m) => m.ArkPluginsModule),
      },
      {
        path: 'supply-drops',
        loadChildren: () => import('./modules/ark-supply-drops/ark-supply-drops.module').then((m) => m.ArkSupplyDropsModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ArkComponent],
})
export class ArkModule {}
