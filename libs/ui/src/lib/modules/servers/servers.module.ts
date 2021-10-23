import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerOverviewComponent } from './components/server-overview/server-overview.component';
import { ServerGridListComponent } from './components/server-grid-list/server-grid-list.component';
import { ServerGridTileOverviewComponent } from './components/server-grid-tile-overview/server-grid-tile-overview.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServerListComponent, ServerOverviewComponent, ServerGridListComponent, ServerGridTileOverviewComponent],
  exports: [ServerListComponent, ServerOverviewComponent, ServerGridListComponent],
})
export class ServersModule {}
