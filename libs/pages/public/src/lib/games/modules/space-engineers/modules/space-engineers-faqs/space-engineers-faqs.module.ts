import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { SpaceEngineersFAQsComponent } from './space-engineers-faqs.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersFAQsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [SpaceEngineersFAQsComponent],
})
export class SpaceEngineersFAQsModule {}
