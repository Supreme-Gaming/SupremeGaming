import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPlayersAndTribesComponent } from './ark-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPlayersAndTribesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ArkPlayersAndTribesModule {}
