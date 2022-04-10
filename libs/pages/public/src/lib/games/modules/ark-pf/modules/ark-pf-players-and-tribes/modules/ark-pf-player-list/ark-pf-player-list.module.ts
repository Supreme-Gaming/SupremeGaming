import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPfPlayerListComponent } from './ark-pf-player-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfPlayerListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPfPlayerListComponent],
})
export class ArkPfPlayerListModule {}
