import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanPlayersAndTribesComponent } from './conan-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: ConanPlayersAndTribesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConanPlayersAndTribesComponent],
})
export class ConanPlayersAndTribesModule {}
