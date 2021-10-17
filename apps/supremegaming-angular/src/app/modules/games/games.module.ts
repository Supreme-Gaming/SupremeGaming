import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FrameModule } from '../frame/frame.module';

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
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule],
  declarations: [GamesComponent],
  exports: [RouterModule],
})
export class GamesModule {}
