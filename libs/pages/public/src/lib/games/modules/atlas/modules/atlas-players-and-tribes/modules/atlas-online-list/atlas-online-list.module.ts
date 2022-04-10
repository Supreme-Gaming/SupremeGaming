import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { AtlasOnlineListComponent } from './atlas-online-list.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasOnlineListComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [AtlasOnlineListComponent],
})
export class AtlasOnlineListModule {}
