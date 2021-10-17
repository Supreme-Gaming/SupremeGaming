import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasPluginsComponent } from './atlas-plugins.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasPluginsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AtlasPluginsModule {}
