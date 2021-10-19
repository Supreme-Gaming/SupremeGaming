import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerOverviewComponent } from './components/server-overview/server-overview.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServerListComponent, ServerOverviewComponent],
  exports: [ServerListComponent, ServerOverviewComponent],
})
export class ServersModule {}
