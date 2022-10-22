import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiLayoutModule } from '@supremegaming/ui';

import { SpaceEngineersModsComponent } from './space-engineers-mods.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceEngineersModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiLayoutModule],
  declarations: [SpaceEngineersModsComponent],
})
export class SpaceEngineersModsModule {}
