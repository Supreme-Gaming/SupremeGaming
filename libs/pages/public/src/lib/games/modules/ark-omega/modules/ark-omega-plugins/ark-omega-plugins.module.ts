import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkOmegaPluginsComponent } from './ark-omega-plugins.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaPluginsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkOmegaPluginsComponent],
})
export class ArkOmegaPluginsModule {}
