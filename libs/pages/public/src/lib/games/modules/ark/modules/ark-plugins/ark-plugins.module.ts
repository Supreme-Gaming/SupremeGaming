import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkPluginsComponent } from './ark-plugins.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPluginsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkPluginsComponent],
})
export class ArkPluginsModule {}
