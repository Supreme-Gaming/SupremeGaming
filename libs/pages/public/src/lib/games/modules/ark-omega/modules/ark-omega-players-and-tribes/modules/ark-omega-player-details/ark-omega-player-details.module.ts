import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkOmegaPlayerDetailsComponent } from './ark-omega-player-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaPlayerDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkOmegaPlayerDetailsComponent],
})
export class ArkOmegaPlayerDetailsModule {}
