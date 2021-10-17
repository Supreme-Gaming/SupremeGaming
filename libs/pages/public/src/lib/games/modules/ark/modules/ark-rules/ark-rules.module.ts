import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkRulesComponent } from './ark-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ArkRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ArkRulesModule {}
