import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPfTribeListComponent } from './ark-pf-tribe-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfTribeListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPfTribeListComponent],
})
export class ArkPfTribeListModule {}
