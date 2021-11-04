import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-ark-pf-player-details',
  templateUrl: './ark-pf-player-details.component.html',
  styleUrls: ['./ark-pf-player-details.component.scss'],
})
export class ArkPfPlayerDetailsComponent implements OnInit {
  public playerGuid: Observable<string>;

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit() {
    this.playerGuid = this.route.params.pipe(pluck('guid'));
  }
}
