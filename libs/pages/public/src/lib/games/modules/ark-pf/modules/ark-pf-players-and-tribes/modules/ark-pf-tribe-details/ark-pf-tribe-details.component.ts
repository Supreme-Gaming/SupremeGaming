import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-ark-pf-tribe-details',
  templateUrl: './ark-pf-tribe-details.component.html',
  styleUrls: ['./ark-pf-tribe-details.component.scss'],
})
export class ArkPfTribeDetailsComponent implements OnInit {
  public tribeGuid: Observable<string>;

  constructor(public route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.tribeGuid = this.route.params.pipe(pluck('guid'));
  }
}
