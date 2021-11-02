import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '@supremegaming/common/ngx';

import { OnlinePlayerListComponent } from './components/online-player-list/online-player-list.component';
import { PlayerSearchListComponent } from './components/player-search-list/player-search-list.component';
import { PlayerTableComponent } from './components/player-table/player-table.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, PipesModule],
  declarations: [OnlinePlayerListComponent, PlayerSearchListComponent, PlayerTableComponent],
  exports: [OnlinePlayerListComponent, PlayerSearchListComponent],
})
export class PlayerTribeExplorerModule {}
