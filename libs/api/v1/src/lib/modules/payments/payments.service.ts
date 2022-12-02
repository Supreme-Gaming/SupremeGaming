import { Injectable } from '@nestjs/common';

import { PaypalRestService } from '@supremegaming/api/core';

@Injectable()
export class PaymentsService {
  constructor(private readonly pp: PaypalRestService) {}

  public capturePayment() {
    return this.pp.getOperatingMode();
  }
}