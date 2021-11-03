import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { AtlasCompanyListComponent } from './atlas-company-list.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasCompanyListComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [AtlasCompanyListComponent],
})
export class AtlasCompanyListModule {}
