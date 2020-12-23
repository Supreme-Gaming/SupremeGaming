import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FrameModule } from '../frame/frame.module';
import { LandingComponent } from './landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule],
  declarations: [LandingComponent],
  exports: [RouterModule],
})
export class LandingModule {}
