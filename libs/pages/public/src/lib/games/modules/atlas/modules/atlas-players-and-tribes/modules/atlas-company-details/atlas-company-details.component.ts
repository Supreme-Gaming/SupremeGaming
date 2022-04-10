import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'supremegaming-atlas-company-details',
  templateUrl: './atlas-company-details.component.html',
  styleUrls: ['./atlas-company-details.component.scss'],
})
export class AtlasCompanyDetailsComponent implements OnInit {
  public tribeGuid: Observable<string>;

  constructor(public route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.tribeGuid = this.route.params.pipe(pluck('guid'));
  }
}
