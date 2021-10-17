import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { AtlasSettingsComponent } from './atlas-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [AtlasSettingsComponent],
})
export class AtlasSettingsModule {}
