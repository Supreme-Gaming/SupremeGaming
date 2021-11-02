import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkTribeSearchComponent } from './ark-tribe-search.component';

const routes: Routes = [
  {
    path: '',
    component: ArkTribeSearchComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkTribeSearchComponent],
})
export class ArkTribeSearchModule {}
