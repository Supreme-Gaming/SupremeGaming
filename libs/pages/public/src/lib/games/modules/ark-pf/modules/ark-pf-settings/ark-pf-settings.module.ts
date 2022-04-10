import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArkPfSettingsComponent } from './ark-pf-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { UiLayoutModule } from '@supremegaming/ui';

const routes: Routes = [
  {
    path: '',
    component: ArkPfSettingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkPfSettingsComponent],
})
export class ArkPfSettingsModule {}
