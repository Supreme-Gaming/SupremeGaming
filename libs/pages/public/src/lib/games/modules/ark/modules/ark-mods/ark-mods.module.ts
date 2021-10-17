import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkModsComponent } from './ark-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ArkModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkModsComponent],
})
export class ArkModsModule {}
