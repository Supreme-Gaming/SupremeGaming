import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { ConanComponent } from './conan.component';

const routes: Routes = [
  {
    path: '',
    component: ConanComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/conan-overview/conan-overview.module').then((m) => m.ConanOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/conan-rules/conan-rules.module').then((m) => m.ConanRulesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/conan-settings/conan-settings.module').then((m) => m.ConanSettingsModule),
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/conan-players-and-tribes/conan-players-and-tribes.module').then(
            (m) => m.ConanPlayersAndTribesModule
          ),
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/conan-mods/conan-mods.module').then((m) => m.ConanModsModule),
      },
      {
        path: 'pippi',
        loadChildren: () => import('./modules/conan-pippi/conan-pippi.module').then((m) => m.ConanPippiModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ConanComponent],
})
export class ConanModule {}
