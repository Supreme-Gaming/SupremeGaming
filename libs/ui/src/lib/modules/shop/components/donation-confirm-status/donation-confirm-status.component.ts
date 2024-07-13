import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { DonationService } from '@supremegaming/data-access';
import { IDonationEntitySummarized } from '@supremegaming/common/entities/v1';

@Component({
  selector: 'supremegaming-donation-confirm-status',
  templateUrl: './donation-confirm-status.component.html',
  styleUrls: ['./donation-confirm-status.component.scss'],
})
export class DonationConfirmStatusComponent implements OnInit {
  public orderId: Observable<string>;

  public disbursementStatus: Observable<Partial<IDonationEntitySummarized>>;
  public summary: Observable<{ ign: string; total: number; impact: string }>;
  public playerId: Observable<string>;
  public paymentDate: Observable<Date>;
  public transactionStatus: Observable<string>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ds: DonationService
  ) {}

  public ngOnInit(): void {
    if (this.route.snapshot.params.id === undefined) {
      console.warn('No order ID found, redirecting to donation page');
      this.router.navigate(['/donate']);
    }

    this.orderId = this.route.params.pipe(
      map((params) => params.id),
      filter((id) => !!id),
      shareReplay()
    );

    this.disbursementStatus = this.orderId.pipe(
      switchMap((orderId) => this.ds.donationStatus(orderId)),
      catchError(() => {
        return of(undefined);
      }),
      shareReplay()
    );

    this.summary = this.disbursementStatus.pipe(
      filter((status) => !!status),
      map((status) => {
        const total = parseFloat(status.Total);
        const impact = ((total / 600) * 730).toFixed(1);

        return {
          ign: status.CharacterName,
          total,
          impact,
        };
      }),
      shareReplay()
    );

    this.playerId = this.disbursementStatus.pipe(map((summary) => summary.PlayerGuid.split('-')[0]));
    this.paymentDate = this.disbursementStatus.pipe(map((summary) => new Date(summary.Summary.transactionDate)));
    this.transactionStatus = this.disbursementStatus.pipe(map((summary) => summary.Summary.transactionStatus.toLowerCase()));
  }
}
