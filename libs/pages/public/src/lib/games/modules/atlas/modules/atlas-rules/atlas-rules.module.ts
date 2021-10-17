import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { AtlasRulesComponent } from './atlas-rules.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [AtlasRulesComponent],
})
export class AtlasRulesModule {}
