import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { SpaceEngineersSettingsComponent } from './space-engineers-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [SpaceEngineersSettingsComponent],
})
export class SpaceEngineersSettingsModule {}
