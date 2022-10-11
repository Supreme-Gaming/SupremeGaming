import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkOmegaModsComponent } from './ark-omega-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ArkOmegaModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkOmegaModsComponent],
})
export class ArkOmegaModsModule {}
