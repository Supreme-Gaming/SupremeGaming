import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServersOnlinePlayerListComponent } from './components/servers-online-player-list/servers-online-player-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServersOnlinePlayerListComponent],
  exports: [ServersOnlinePlayerListComponent],
})
export class PlayerTribeExplorerModule {}
