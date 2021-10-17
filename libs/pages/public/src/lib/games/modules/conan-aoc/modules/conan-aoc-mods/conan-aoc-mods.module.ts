import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanAocModsComponent } from './conan-aoc-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ConanAocModsModule {}
