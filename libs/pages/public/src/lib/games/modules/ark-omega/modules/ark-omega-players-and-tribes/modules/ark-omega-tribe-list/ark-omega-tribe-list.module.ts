import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkOmegaTribeListComponent } from './ark-omega-tribe-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaTribeListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkOmegaTribeListComponent],
})
export class ArkOmegaTribeListModule {}
