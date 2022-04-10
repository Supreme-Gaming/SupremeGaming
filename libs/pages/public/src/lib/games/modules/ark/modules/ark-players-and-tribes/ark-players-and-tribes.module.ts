import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPlayersAndTribesComponent } from './ark-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPlayersAndTribesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./modules/ark-online-list/ark-online-list.module').then((m) => m.ArkOnlineListModule),
        data: {
          meta: {
            title: 'Ark Online Players',
          },
        },
      },
      {
        path: 'survivors/:guid',
        loadChildren: () =>
          import('./modules/ark-player-details/ark-player-details.module').then((m) => m.ArkPlayerDetailsModule),
        data: {
          meta: {
            title: 'Ark Survivor Details',
          },
        },
      },
      {
        path: 'survivors',
        loadChildren: () => import('./modules/ark-players-list/ark-players-list.module').then((m) => m.ArkPlayersListModule),
        data: {
          meta: {
            title: 'Ark Survivor Search',
          },
        },
      },
      {
        path: 'tribes/:guid',
        loadChildren: () =>
          import('./modules/ark-tribe-details/ark-tribe-details.module').then((m) => m.ArkTribeDetailsModule),
        data: {
          meta: {
            title: 'Ark Tribes Search',
          },
        },
      },
      {
        path: 'tribes',
        loadChildren: () => import('./modules/ark-tribes-list/ark-tribes-list.module').then((m) => m.ArkTribesListModule),
        data: {
          meta: {
            title: 'Ark Tribe Search',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPlayersAndTribesComponent],
})
export class ArkPlayersAndTribesModule {}
