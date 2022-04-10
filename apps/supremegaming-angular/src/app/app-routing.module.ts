import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@supremegaming/pages/public').then((m) => m.LandingModule),
  },
  {
    path: 'community',
    loadChildren: () => import('@supremegaming/pages/public').then((m) => m.CommunityModule),
  },
  {
    path: 'games',
    loadChildren: () => import('@supremegaming/pages/public').then((m) => m.GamesModule),
  },
  {
    path: 'donate',
    loadChildren: () => import('@supremegaming/pages/public').then((m) => m.DonationModule),
    data: {
      meta: {
        title: 'Donate and Support the Community',
      },
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
