import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AtlasModsComponent } from './atlas-mods.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class AtlasModsModule {}
