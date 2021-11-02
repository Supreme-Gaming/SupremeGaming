import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPlayerDetailsComponent } from './ark-player-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPlayerDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPlayerDetailsComponent],
})
export class ArkPlayerDetailsModule {}
