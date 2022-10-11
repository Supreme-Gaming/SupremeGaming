import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkOmegaTribeDetailsComponent } from './ark-omega-tribe-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaTribeDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkOmegaTribeDetailsComponent],
})
export class ArkOmegaTribeDetailsModule {}
