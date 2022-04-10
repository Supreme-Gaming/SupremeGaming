import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-ark-tribe-details',
  templateUrl: './ark-tribe-details.component.html',
  styleUrls: ['./ark-tribe-details.component.scss'],
})
export class ArkTribeDetailsComponent implements OnInit {
  public tribeGuid: Observable<string>;

  constructor(public route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.tribeGuid = this.route.params.pipe(pluck('guid'));
  }
}
