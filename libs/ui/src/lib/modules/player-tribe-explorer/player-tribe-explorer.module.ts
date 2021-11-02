import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlinePlayerListComponent } from './components/online-player-list/online-player-list.component';
import { PlayerSearchListComponent } from './components/player-search-list/player-search-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OnlinePlayerListComponent, PlayerSearchListComponent],
  exports: [OnlinePlayerListComponent, PlayerSearchListComponent],
})
export class PlayerTribeExplorerModule {}
