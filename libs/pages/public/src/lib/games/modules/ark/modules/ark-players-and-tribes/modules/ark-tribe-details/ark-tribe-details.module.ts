import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkTribeDetailsComponent } from './ark-tribe-details.component';

const routes: Routes = [
  {
    path: '',
    component: ArkTribeDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkTribeDetailsComponent],
})
export class ArkTribeDetailsModule {}
