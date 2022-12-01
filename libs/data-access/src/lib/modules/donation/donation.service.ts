import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvironmentService } from '@supremegaming/common/ngx';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  public service: string;

  constructor(private readonly http: HttpClient, private readonly env: EnvironmentService) {
    this.service = this.env.value('apiUrl') + '/donations';
  }

  public captureDonation(t_id: string) {
    return this.http.get(`${this.service}/process/${t_id}`);
  }
}
