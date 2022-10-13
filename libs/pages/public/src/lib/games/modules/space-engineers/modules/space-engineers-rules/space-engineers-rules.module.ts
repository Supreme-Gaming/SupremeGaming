import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { SpaceEngineersRulesComponent } from './space-engineers-rules.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [SpaceEngineersRulesComponent],
})
export class SpaceEngineersRulesModule {}
