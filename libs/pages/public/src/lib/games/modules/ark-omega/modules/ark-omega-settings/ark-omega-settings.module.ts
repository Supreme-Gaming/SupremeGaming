import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArkOmegaSettingsComponent } from './ark-omega-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { UiLayoutModule } from '@supremegaming/ui';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkOmegaSettingsComponent],
})
export class ArkOmegaSettingsModule {}
