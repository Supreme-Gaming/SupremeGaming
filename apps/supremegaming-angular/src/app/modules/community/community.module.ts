import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FrameModule } from '../frame/frame.module';
import { CommunityComponent } from './community.component';

import { ParsingModule } from '../utilities/parsing/parsing.module';

const routes: Routes = [
  {
    path: '',
    // component: CommunityComponent,
    redirectTo: 'rules',
  },
  {
    path: 'rules',
    component: CommunityComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule, ParsingModule],
  declarations: [CommunityComponent],
  exports: [RouterModule],
})
export class CommunityModule {}
