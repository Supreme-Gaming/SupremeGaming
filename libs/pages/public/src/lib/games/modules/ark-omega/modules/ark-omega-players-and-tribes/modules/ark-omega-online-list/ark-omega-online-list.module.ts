import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkOmegaOnlineListComponent } from './ark-omega-online-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaOnlineListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkOmegaOnlineListComponent],
})
export class ArkOmegaOnlineListModule {}
