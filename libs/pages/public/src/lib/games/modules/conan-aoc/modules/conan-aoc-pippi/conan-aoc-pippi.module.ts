import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanAocPippiComponent } from './conan-aoc-pippi.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocPippiComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConanAocPippiComponent],
})
export class ConanAocPippiModule {}
