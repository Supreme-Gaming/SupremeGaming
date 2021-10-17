import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ConanRulesComponent } from './conan-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ConanRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ConanRulesComponent],
})
export class ConanRulesModule {}
