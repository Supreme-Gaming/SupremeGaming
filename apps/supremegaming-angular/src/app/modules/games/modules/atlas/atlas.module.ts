import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasComponent } from './atlas.component';
import { FrameModule } from '../../../frame/frame.module';

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
        path: 'mods',
        loadChildren: () => import('./modules/atlas-mods/atlas-mods.module').then((m) => m.AtlasModsModule),
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
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule],
  declarations: [AtlasComponent],
})
export class AtlasModule {}