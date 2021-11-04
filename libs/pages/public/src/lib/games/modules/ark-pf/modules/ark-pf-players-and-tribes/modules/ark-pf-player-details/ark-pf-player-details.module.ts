import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPfPlayerDetailsComponent } from './ark-pf-player-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfPlayerDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPfPlayerDetailsComponent],
})
export class ArkPfPlayerDetailsModule {}
