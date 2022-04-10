import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfPlayersAndTribesComponent } from './ark-pf-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfPlayersAndTribesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/ark-pf-online-list/ark-pf-online-list.module').then((m) => m.ArkPfOnlineListModule),
        data: {
          meta: {
            title: 'Ark PF Online Players',
          },
        },
      },
      {
        path: 'survivors/:guid',
        loadChildren: () =>
          import('./modules/ark-pf-player-details/ark-pf-player-details.module').then((m) => m.ArkPfPlayerDetailsModule),
        data: {
          meta: {
            title: 'Ark PF Survivor Details',
          },
        },
      },
      {
        path: 'survivors',
        loadChildren: () =>
          import('./modules/ark-pf-player-list/ark-pf-player-list.module').then((m) => m.ArkPfPlayerListModule),
        data: {
          meta: {
            title: 'Ark PF Survivor Search',
          },
        },
      },
      {
        path: 'tribes/:guid',
        loadChildren: () =>
          import('./modules/ark-pf-tribe-details/ark-pf-tribe-details.module').then((m) => m.ArkPfTribeDetailsModule),
        data: {
          meta: {
            title: 'Ark PF Tribe Details',
          },
        },
      },
      {
        path: 'tribes',
        loadChildren: () =>
          import('./modules/ark-pf-tribe-list/ark-pf-tribe-list.module').then((m) => m.ArkPfTribeListModule),
        data: {
          meta: {
            title: 'Ark PF Tribe Search',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPfPlayersAndTribesComponent],
})
export class ArkPfPlayersAndTribesModule {}
