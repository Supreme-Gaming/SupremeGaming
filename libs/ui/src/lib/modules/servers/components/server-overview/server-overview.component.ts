import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { GameServer } from '@supremegaming/common/interfaces';
import { ServersService } from '@supremegaming/data-access';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-server-overview',
  templateUrl: './server-overview.component.html',
  styleUrls: ['./server-overview.component.scss'],
})
export class ServerOverviewComponent implements OnInit {
  @Input()
  public server: GameServer;

  public connection: SafeUrl;

  public status: Observable<string>;

  constructor(private sanitizer: DomSanitizer, private ss: ServersService) {}

  public ngOnInit(): void {
    this.connection = this.sanitizer.bypassSecurityTrustUrl(`steam://connect/${this.server.host}:${this.server.port}`);
    this.status = this.ss.getServerStatus(this.server).pipe(shareReplay());
  }
}
