import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { LoggerService } from '../logger/logger.service';

export const PAYPAL_REST_OPTIONS = 'PAYPAL_REST_OPTIONS';

@Injectable()
export class PaypalRestService {
  private _mode: 'sandbox' | 'live';
  private _clientId: string;
  private _clientSecret: string;

  private _apiUrl: string;

  private _identity: Observable<any>;
  private _bearerToken: ReplaySubject<string> = new ReplaySubject();
  private _nextAccessTokenAcquisition: ReplaySubject<number> = new ReplaySubject();

  constructor(private readonly log: LoggerService, private readonly http: HttpService) {
    this.preFlightCheck();
  }

  private preFlightCheck() {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET || !process.env.PAYPAL_MODE) {
      throw new Error('PaypalRestService: Missing options');
    } else {
      this._setEvnVars();

      this.log.log(`PaypalRestService Ready for takeoff: ${this._mode}`);

      this._configureLifecycle();
    }
  }

  private _setEvnVars() {
    this._clientId = process.env.PAYPAL_CLIENT_ID;
    this._clientSecret = process.env.PAYPAL_SECRET;

    // Default to sandbox
    this._mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';

    if (this._mode === 'live') {
      this._apiUrl = 'https://api.sandbox.paypal.com';
    } else {
      this._apiUrl = 'https://api-m.sandbox.paypal.com';
    }
  }

  private _configureLifecycle() {
    this._identity = this._authenticate();
  }

  private _authenticate(count = 1): Observable<any> {
    this.log.log('PaypalRestService: _authenticate()');

    return this.http
      .request({
        method: 'POST',
        url: `${this._apiUrl}/v1/oauth2/tokenss`,
        withCredentials: true,
        data: 'grant_type=client_credentials',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/json',
        },
        auth: {
          username: this._clientId,
          password: this._clientSecret,
        },
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          // Exponential back-off with max 16 seconds delay
          const nextCount = count === 4 ? 4 : count + 1;
          const nextTimer = 1000 * Math.pow(2, nextCount);

          this.log.error(
            `PaypalRestService: authenticate. Retrying attempt ${count + 1} in ${nextTimer / 1000} seconds`,
            err.message
          );

          return timer(nextTimer).pipe(switchMap(() => this._authenticate(count + 1)));
        })
      );
  }

  public getOperatingMode(): any {
    // return this._mode;
    return this._authenticate();
  }
}

export interface IPayPalRestOptions {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}
