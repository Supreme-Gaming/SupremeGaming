import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, shareReplay, switchMap } from 'rxjs';

import { DonationService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-donation-confirm-status',
  templateUrl: './donation-confirm-status.component.html',
  styleUrls: ['./donation-confirm-status.component.scss'],
})
export class DonationConfirmStatusComponent implements OnInit {
  public orderId: Observable<string>;

  public disbursementStatus: Observable<any>;

  constructor(private readonly route: ActivatedRoute, private readonly ds: DonationService) {}

  public ngOnInit(): void {
    this.orderId = this.route.params.pipe(
      map((params) => params.id),
      filter((id) => !!id),
      shareReplay()
    );

    this.disbursementStatus = this.orderId.pipe(
      switchMap((orderId) => this.ds.captureDonation(orderId)),
      shareReplay()
    );
  }
}
