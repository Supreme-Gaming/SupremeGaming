import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { ArkPfTribeDetailsComponent } from './ark-pf-tribe-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfTribeDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [ArkPfTribeDetailsComponent],
})
export class ArkPfTribeDetailsModule {}
