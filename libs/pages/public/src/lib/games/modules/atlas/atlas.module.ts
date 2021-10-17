import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasComponent } from './atlas.component';
import { UiSkeletonModule } from '@supremegaming/ui';

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
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/atlas-settings/atlas-settings.module').then((m) => m.AtlasSettingsModule),
      },
      {
        path: 'mods',
        loadChildren: () => import('./modules/atlas-mods/atlas-mods.module').then((m) => m.AtlasModsModule),
      },
      {
        path: 'plugins',
        loadChildren: () => import('./modules/atlas-plugins/atlas-plugins.module').then((m) => m.AtlasPluginsModule),
      },
      {
        path: 'players-and-tribes',
        loadChildren: () =>
          import('./modules/atlas-players-and-tribes/atlas-players-and-tribes.module').then(
            (m) => m.AtlasPlayersAndTribesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [AtlasComponent],
})
export class AtlasModule {}
