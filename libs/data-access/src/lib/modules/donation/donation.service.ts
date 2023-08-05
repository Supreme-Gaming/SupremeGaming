import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  public service: string;

  constructor(private readonly http: HttpClient, private readonly env: EnvironmentService) {
    this.service = this.env.value<SupremeGamingEnvironment, string>('v1ApiUrl') + '/payments';
  }

  public captureDonation(t_id: string) {
    return this.http.post(`${this.service}/capture/`, { id: t_id });
  }
}
