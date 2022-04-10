import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkPfModsComponent } from './ark-pf-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkPfModsComponent],
})
export class ArkPfModsModule {}
