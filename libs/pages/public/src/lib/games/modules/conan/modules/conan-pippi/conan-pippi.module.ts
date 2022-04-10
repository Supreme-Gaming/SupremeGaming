import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ConanPippiComponent } from './conan-pippi.component';

const routes: Routes = [
  {
    path: '',
    component: ConanPippiComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ConanPippiComponent],
})
export class ConanPippiModule {}
