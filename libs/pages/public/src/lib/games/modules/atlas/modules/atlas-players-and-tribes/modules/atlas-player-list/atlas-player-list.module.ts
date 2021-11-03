import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { AtlasPlayerListComponent } from './atlas-player-list.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasPlayerListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [AtlasPlayerListComponent],
})
export class AtlasPlayerListModule {}
