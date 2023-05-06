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

  public getOrderDetails(t_id: string): Observable<IPayPalRestOrder> {
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

export interface IPayPalRestOrder {
  id: string;
  intent: string;
  status: string;
  payment_source: IPayPalRestPaymentSource;
  purchase_units: IPayPalRestPurchaseUnit[];
  payer: IPayPalRestPayer;
  create_time: string;
  update_time: string;
  links: IPayPalRestLink[];
}

export interface IPayPalRestPaymentSource {
  paypal?: {
    email_address: string;
    account_id: string;
    name: {
      given_name: string;
      surname: string;
    };
    address: {
      country_code: string;
    };
  };
}

export interface IPayPalRestPayer {
  name: {
    given_name: string;
    surname: string;
  };
  email_address: string;
  payer_id: string;
  address: {
    country_code: string;
  };
}

interface IPayPalRestPurchaseUnit {
  reference_id: string;
  amount: IPayPalRestAmount;
  payee: IPayPalRestPayee;
  items: IPayPalRestItem[];
  shipping: IPayPalRestShipping;
  payments: IPayPalRestPayment;
}

interface IPayPalRestAmount {
  currency_code: string;
  value: string;
  breakdown?: IPayPalRestBreakdown;
}

interface IPayPalRestBreakdown {
  item_total: IPayPalRestItemTotal;
}

interface IPayPalRestItemTotal {
  currency_code: string;
  value: string;
}

interface IPayPalRestPayee {
  email_address: string;
  merchant_id: string;
}

interface IPayPalRestItem {
  name: string;
  unit_amount: IPayPalRestUnitAmount;
  quantity: string;
  category: string;
  description?: string;
  sku: string;
}

interface IPayPalRestUnitAmount {
  currency_code: string;
  value: string;
}

interface IPayPalRestShipping {
  name: IPayPalRestName;
  address: IPayPalRestAddress;
}

interface IPayPalRestName {
  full_name: string;
}

interface IPayPalRestAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

interface IPayPalRestPayment {
  captures: IPayPalRestCapture[];
}

interface IPayPalRestCapture {
  id: string;
  status: string;
  amount: IPayPalRestAmount;
  final_capture: boolean;
  seller_protection: IPayPalRestSellerProtection;
  seller_receivable_breakdown: IPayPalRestSellerReceivableBreakdown;
  links: IPayPalRestLink[];
}

interface IPayPalRestSellerProtection {
  status: string;
  dispute_categories: string[];
}

interface IPayPalRestSellerReceivableBreakdown {
  gross_amount: IPayPalRestAmount;
  paypal_fee: IPayPalRestAmount;
  net_amount: IPayPalRestAmount;
}

interface IPayPalRestLink {
  href: string;
  rel: string;
  method: string;
}
