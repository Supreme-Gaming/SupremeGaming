import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FrameModule } from '../frame/frame.module';

import { GamesComponent } from './games.component';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
  },
  {
    path: 'ark',
    component: GamesComponent,
  },
  {
    path: 'atlas',
    component: GamesComponent,
  },
  {
    path: 'conan',
    component: GamesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FrameModule],
  declarations: [GamesComponent],
  exports: [RouterModule],
})
export class GamesModule {}
