import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { AtlasPlayerDetailsComponent } from './atlas-player-details.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasPlayerDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [AtlasPlayerDetailsComponent],
})
export class AtlasPlayerDetailsModule {}
