import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkTribesListComponent } from './ark-tribes-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkTribesListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkTribesListComponent],
})
export class ArkTribesListModule {}
