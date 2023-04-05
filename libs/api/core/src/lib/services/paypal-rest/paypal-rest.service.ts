import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

import { LoggerService } from '../logger/logger.service';

export const PAYPAL_REST_OPTIONS = 'PAYPAL_REST_OPTIONS';

@Injectable()
export class PaypalRestService {
  private _mode: 'sandbox' | 'live';
  private _clientId: string;
  private _clientSecret: string;

  private _apiUrl: string;

  private _identity: Observable<IPayPalRestIdentity>;
  private _bearerToken: Observable<string>;
  private _nextAccessTokenAcquisition: Observable<number>;

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
      this._apiUrl = 'https://api.paypal.com';
    } else {
      this._apiUrl = 'https://api.sandbox.paypal.com';
    }
  }

  private _configureLifecycle() {
    this._identity = this._authenticate();
    this._bearerToken = this._identity.pipe(map((identity) => identity.access_token));
    this._nextAccessTokenAcquisition = this._identity.pipe(map((identity) => identity.expires_in));
  }

  private _authenticate(count = 1): Observable<IPayPalRestIdentity> {
    this.log.log('PaypalRestService: _authenticate()');

    return this.http
      .request({
        method: 'POST',
        url: `${this._apiUrl}/v1/oauth2/token`,
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
        }),
        shareReplay()
      );
  }

  public getOperatingMode() {
    return this._bearerToken;
  }

  public getOrderDetails(t_id: string): Observable<unknown> {
    return this._identity.pipe(
      switchMap((identity) => {
        return this.http
          .get(`${this._apiUrl}/v2/checkout/orders/${t_id}`, {
            headers: {
              Authorization: `Bearer ${identity.access_token}`,
            },
          })
          .pipe(map((res) => res.data));
      })
    );
  }
}

export interface IPayPalRestOptions {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

export interface IPayPalRestIdentity {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}
