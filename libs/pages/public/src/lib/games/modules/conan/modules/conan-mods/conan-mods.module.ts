import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { ConanModsComponent } from './conan-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ConanModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [ConanModsComponent],
})
export class ConanModsModule {}
