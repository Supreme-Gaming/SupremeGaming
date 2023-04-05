import { Controller, Get } from '@nestjs/common';

import { GetPayPalOrderDetailsDto } from './payments.dtos';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly ps: PaymentsService) {}

  @Get('status/:id')
  public getDisbursementStatus() {
    return this.ps.getOrderDetails();
  }
}
