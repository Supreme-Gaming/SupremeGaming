import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArkPfPluginsComponent } from './ark-pf-plugins.component';

const routes: Routes = [
  {
    path: '',
    component: ArkPfPluginsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ArkPfPluginsComponent],
})
export class ArkPfPluginsModule {}
