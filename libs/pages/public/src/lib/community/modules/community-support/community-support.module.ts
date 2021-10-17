import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { CommunitySupportComponent } from './community-support.component';

const routes: Routes = [
  {
    path: '',
    component: CommunitySupportComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [CommunitySupportComponent],
})
export class CommunitySupportModule {}
