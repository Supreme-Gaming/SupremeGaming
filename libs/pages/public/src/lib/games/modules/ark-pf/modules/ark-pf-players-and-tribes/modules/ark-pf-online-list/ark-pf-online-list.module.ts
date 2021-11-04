import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPfOnlineListComponent } from './ark-pf-online-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfOnlineListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPfOnlineListComponent],
})
export class ArkPfOnlineListModule {}
