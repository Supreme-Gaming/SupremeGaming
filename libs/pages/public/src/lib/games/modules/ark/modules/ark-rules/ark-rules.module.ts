import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkRulesComponent } from './ark-rules.component';

const routes: Routes = [
  {
    path: '',
    component: ArkRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkRulesComponent],
})
export class ArkRulesModule {}
