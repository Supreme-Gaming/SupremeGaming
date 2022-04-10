import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPlayersListComponent } from './ark-players-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPlayersListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPlayersListComponent],
})
export class ArkPlayersListModule {}
