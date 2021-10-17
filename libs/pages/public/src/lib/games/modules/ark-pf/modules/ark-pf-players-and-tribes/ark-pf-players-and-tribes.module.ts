import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfPlayersAndTribesComponent } from './ark-pf-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfPlayersAndTribesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPfPlayersAndTribesComponent],
})
export class ArkPfPlayersAndTribesModule {}
