import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPlayerSearchComponent } from './ark-player-search.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPlayerSearchComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPlayerSearchComponent],
})
export class ArkPlayerSearchModule {}
