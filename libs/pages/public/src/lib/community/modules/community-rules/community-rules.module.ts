import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { CommunityRulesComponent } from './community-rules.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityRulesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [CommunityRulesComponent],
})
export class CommunityRulesModule {}
