import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConanAocRulesComponent } from './conan-aoc-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ConanAocRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConanAocRulesComponent],
})
export class ConanAocRulesModule {}
