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
        data: {
          meta: {
            title: 'Supreme Atlas',
            description: 'Supreme Atlas server connections, map, status checkers, and more!',
            image: 'https://static.supremegaming.gg/images/atlas/grid/0/MapImg.png',
          },
        },
      },
      {
        path: 'ark',
        loadChildren: () => import('./modules/ark/ark.module').then((m) => m.ArkModule),
        data: {
          meta: {
            title: 'Supreme Ark',
          },
        },
      },
      {
        path: 'ark-pf',
        loadChildren: () => import('./modules/ark-pf/ark-pf.module').then((m) => m.ArkPfModule),
        data: {
          meta: {
            title: 'Supreme Ark Primal Fear',
          },
        },
      },
      {
        path: 'ark-omega',
        loadChildren: () => import('./modules/ark-omega/ark-omega.module').then((m) => m.ArkOmegaModule),
        data: {
          meta: {
            title: 'Supreme Ark Omega',
          },
        },
      },
      {
        path: 'conan',
        loadChildren: () => import('./modules/conan/conan.module').then((m) => m.ConanModule),
        data: {
          meta: {
            title: 'Supreme Conan Exiles',
          },
        },
      },
      {
        path: 'space-engineers',
        loadChildren: () => import('./modules/space-engineers/space-engineers.module').then((m) => m.SpaceEngineersModule),
        data: {
          meta: {
            title: 'Supreme Space Engineers',
          },
        },
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
