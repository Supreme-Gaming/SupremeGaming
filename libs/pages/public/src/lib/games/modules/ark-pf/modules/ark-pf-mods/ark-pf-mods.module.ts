import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfModsComponent } from './ark-pf-mods.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfModsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPfModsComponent],
})
export class ArkPfModsModule {}
