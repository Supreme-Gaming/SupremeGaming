import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfRulesComponent } from './ark-pf-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ArkPfRulesModule {}
