import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasPlayersAndTribesComponent } from './atlas-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasPlayersAndTribesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/atlas-online-list/atlas-online-list.module').then((m) => m.AtlasOnlineListModule),
      },
      {
        path: 'pathfinders/:guid',
        loadChildren: () =>
          import('./modules/atlas-player-details/atlas-player-details.module').then((m) => m.AtlasPlayerDetailsModule),
      },
      {
        path: 'pathfinders',
        loadChildren: () =>
          import('./modules/atlas-player-list/atlas-player-list.module').then((m) => m.AtlasPlayerListModule),
      },
      {
        path: 'companies/:guid',
        loadChildren: () =>
          import('./modules/atlas-company-details/atlas-company-details.module').then((m) => m.AtlasCompanyDetailsModule),
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./modules/atlas-company-list/atlas-company-list.module').then((m) => m.AtlasCompanyListModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [AtlasPlayersAndTribesComponent],
})
export class AtlasPlayersAndTribesModule {}
