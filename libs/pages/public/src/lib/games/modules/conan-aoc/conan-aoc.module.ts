import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { ConanAocComponent } from './conan-aoc.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/conan-aoc-overview/conan-aoc-overview.module').then((m) => m.ConanAocOverviewModule),
      },
      {
        path: 'rules',
        loadChildren: () => import('./modules/conan-aoc-rules/conan-aoc-rules.module').then((m) => m.ConanAocRulesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/conan-settings/conan-settings.module').then((m) => m.ConanSettingsModule),
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/conan-aoc-players-and-tribes/conan-aoc-players-and-tribes.module').then(
            (m) => m.ConanAocPlayersAndTribesModule
          ),
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/conan-aoc-mods/conan-aoc-mods.module').then((m) => m.ConanAocModsModule),
      },
      {
        path: 'pippi',
        loadChildren: () => import('./modules/conan-aoc-pippi/conan-aoc-pippi.module').then((m) => m.ConanAocPippiModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [ConanAocComponent],
})
export class ConanAocModule {}
