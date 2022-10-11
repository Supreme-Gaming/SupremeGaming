import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkOmegaPlayerListComponent } from './ark-omega-player-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaPlayerListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkOmegaPlayerListComponent],
})
export class ArkOmegaPlayerListModule {}
