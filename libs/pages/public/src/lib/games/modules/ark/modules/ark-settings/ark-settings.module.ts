import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkSettingsComponent } from './ark-settings.component';
import { UiLayoutModule } from '@supremegaming/ui';

const routes: Routes = [
  {
    path: '',
    component: ArkSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkSettingsComponent],
})
export class ArkSettingsModule {}
