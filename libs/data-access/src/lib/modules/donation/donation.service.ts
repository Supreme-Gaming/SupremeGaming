import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { DonationEntity } from '@supremegaming/common/entities/v1';
import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  public service: string;

  constructor(private readonly http: HttpClient, private readonly env: EnvironmentService) {
    this.service = this.env.value<SupremeGamingEnvironment, string>('v2ApiUrl') + '/payments';
  }

  public donationStatus(t_id: string) {
    return this.http.get<Partial<DonationEntity>>(`${this.service}/status/${t_id}`);
  }
}
