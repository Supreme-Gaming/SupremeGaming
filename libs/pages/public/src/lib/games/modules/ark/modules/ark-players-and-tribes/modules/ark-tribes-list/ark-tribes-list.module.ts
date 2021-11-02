import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkTribesListComponent } from './ark-tribes-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArkTribesListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkTribesListComponent],
})
export class ArkTribesListModule {}
