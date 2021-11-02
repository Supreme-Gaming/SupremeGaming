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
        loadChildren: () => import('./modules/ark-online-list/ark-online-list.module').then((m) => m.ArkOnlineListModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPlayersAndTribesComponent],
})
export class ArkPlayersAndTribesModule {}
