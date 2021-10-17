import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasPlayersAndTribesComponent } from './atlas-players-and-tribes.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasPlayersAndTribesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [AtlasPlayersAndTribesComponent],
})
export class AtlasPlayersAndTribesModule {}
