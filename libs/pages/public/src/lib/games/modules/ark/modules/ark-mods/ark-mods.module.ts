import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ArkModsComponent } from './ark-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ArkModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ArkModsComponent],
})
export class ArkModsModule {}
