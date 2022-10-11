import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkOmegaPlayersAndTribesComponent } from './ark-omega-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaPlayersAndTribesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/ark-omega-online-list/ark-omega-online-list.module').then((m) => m.ArkOmegaOnlineListModule),
        data: {
          meta: {
            title: 'Ark Omega Online Players',
          },
        },
      },
      {
        path: 'survivors/:guid',
        loadChildren: () =>
          import('./modules/ark-omega-player-details/ark-omega-player-details.module').then(
            (m) => m.ArkOmegaPlayerDetailsModule
          ),
        data: {
          meta: {
            title: 'Ark Omega Survivor Details',
          },
        },
      },
      {
        path: 'survivors',
        loadChildren: () =>
          import('./modules/ark-omega-player-list/ark-omega-player-list.module').then((m) => m.ArkOmegaPlayerListModule),
        data: {
          meta: {
            title: 'Ark Omega Survivor Search',
          },
        },
      },
      {
        path: 'tribes/:guid',
        loadChildren: () =>
          import('./modules/ark-omega-tribe-details/ark-omega-tribe-details.module').then(
            (m) => m.ArkOmegaTribeDetailsModule
          ),
        data: {
          meta: {
            title: 'Ark Omega Tribe Details',
          },
        },
      },
      {
        path: 'tribes',
        loadChildren: () =>
          import('./modules/ark-omega-tribe-list/ark-omega-tribe-list.module').then((m) => m.ArkOmegaTribeListModule),
        data: {
          meta: {
            title: 'Ark Omega Tribe Search',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkOmegaPlayersAndTribesComponent],
})
export class ArkOmegaPlayersAndTribesModule {}
