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
      },
      {
        path: 'survivors/:guid',
        loadChildren: () =>
          import('./modules/ark-pf-player-details/ark-pf-player-details.module').then((m) => m.ArkPfPlayerDetailsModule),
      },
      {
        path: 'survivors',
        loadChildren: () =>
          import('./modules/ark-pf-player-list/ark-pf-player-list.module').then((m) => m.ArkPfPlayerListModule),
      },
      {
        path: 'tribes/:guid',
        loadChildren: () =>
          import('./modules/ark-pf-tribe-details/ark-pf-tribe-details.module').then((m) => m.ArkPfTribeDetailsModule),
      },
      {
        path: 'tribes',
        loadChildren: () =>
          import('./modules/ark-pf-tribe-list/ark-pf-tribe-list.module').then((m) => m.ArkPfTribeListModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPfPlayersAndTribesComponent],
})
export class ArkPfPlayersAndTribesModule {}
