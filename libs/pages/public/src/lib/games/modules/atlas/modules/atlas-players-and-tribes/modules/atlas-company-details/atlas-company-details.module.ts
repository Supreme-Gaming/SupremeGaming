import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlayerTribeExplorerModule } from '@supremegaming/ui';

import { AtlasCompanyDetailsComponent } from './atlas-company-details.component';

const routes: Routes = [
  {
    path: '',
    component: AtlasCompanyDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PlayerTribeExplorerModule],
  declarations: [AtlasCompanyDetailsComponent],
})
export class AtlasCompanyDetailsModule {}
