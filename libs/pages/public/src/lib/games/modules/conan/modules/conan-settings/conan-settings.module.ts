import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ConanSettingsComponent } from './conan-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ConanSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ConanSettingsComponent],
})
export class ConanSettingsModule {}
