import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiSkeletonModule } from '@supremegaming/ui';

import { GamesComponent } from './games.component';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./modules/common/overview/overview.module').then((m) => m.OverviewModule),
      },
      {
        path: 'atlas',
        loadChildren: () => import('./modules/atlas/atlas.module').then((m) => m.AtlasModule),
      },
      {
        path: 'ark',
        loadChildren: () => import('./modules/ark/ark.module').then((m) => m.ArkModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiSkeletonModule],
  declarations: [GamesComponent],
  exports: [RouterModule],
})
export class GamesModule {}
