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
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [AtlasPlayersAndTribesComponent],
})
export class AtlasPlayersAndTribesModule {}
