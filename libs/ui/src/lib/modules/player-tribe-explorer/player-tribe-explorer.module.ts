import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipesModule } from '@supremegaming/common/ngx';

import { OnlinePlayerListComponent } from './components/online-player-list/online-player-list.component';
import { PlayerSearchListComponent } from './components/player-search-list/player-search-list.component';
import { PlayerTableComponent } from './components/player-table/player-table.component';
import { TribeTableComponent } from './components/tribe-table/tribe-table.component';
import { TribeSearchListComponent } from './components/tribe-search-list/tribe-search-list.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, PipesModule, RouterModule],
  declarations: [
    OnlinePlayerListComponent,
    PlayerSearchListComponent,
    PlayerTableComponent,
    TribeSearchListComponent,
    TribeTableComponent,
  ],
  exports: [OnlinePlayerListComponent, PlayerSearchListComponent, TribeSearchListComponent],
})
export class PlayerTribeExplorerModule {}
