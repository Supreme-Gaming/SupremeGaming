import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-atlas-player-details',
  templateUrl: './atlas-player-details.component.html',
  styleUrls: ['./atlas-player-details.component.scss'],
})
export class AtlasPlayerDetailsComponent implements OnInit {
  public playerGuid: Observable<string>;

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit() {
    this.playerGuid = this.route.params.pipe(pluck('guid'));
  }
}
