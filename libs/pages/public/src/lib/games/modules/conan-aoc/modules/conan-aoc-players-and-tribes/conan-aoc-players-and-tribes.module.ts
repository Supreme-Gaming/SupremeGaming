import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanAocPlayersAndTribesComponent } from './conan-aoc-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocPlayersAndTribesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ConanAocPlayersAndTribesModule {}
