import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerOverviewComponent } from './components/server-overview/server-overview.component';
import { ServerGridListComponent } from './components/server-grid-list/server-grid-list.component';
import { ServerGridTileOverviewComponent } from './components/server-grid-tile-overview/server-grid-tile-overview.component';
import { AtlasGridColumnIndexPipe } from './pipes/atlas-grid-column-index/atlas-grid-column-index.pipe';
import { AtlasGridRowIndexPipe } from './pipes/atlas-grid-row-index/atlas-grid-row-index.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ServerListComponent,
    ServerOverviewComponent,
    ServerGridListComponent,
    ServerGridTileOverviewComponent,
    AtlasGridColumnIndexPipe,
    AtlasGridRowIndexPipe,
  ],
  exports: [ServerListComponent, ServerOverviewComponent, ServerGridListComponent],
})
export class ServersModule {}
