import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'community',
    loadChildren: () => import('./modules/community/community.module').then((m) => m.CommunityModule),
  },
  {
    path: 'games',
    loadChildren: () => import('./modules/games/games.module').then((m) => m.GamesModule),
  },
  {
    path: 'donate',
    loadChildren: () => import('./modules/donation/donation.module').then((m) => m.DonationModule),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
