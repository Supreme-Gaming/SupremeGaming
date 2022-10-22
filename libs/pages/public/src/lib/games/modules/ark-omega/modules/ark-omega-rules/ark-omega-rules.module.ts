import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkOmegaRulesComponent } from './ark-omega-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkOmegaRulesComponent],
})
export class ArkOmegaRulesModule {}
