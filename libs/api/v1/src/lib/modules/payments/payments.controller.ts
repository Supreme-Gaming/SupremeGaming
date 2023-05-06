import { Controller, Get, Param } from '@nestjs/common';

import { GetPayPalOrderDetailsDto } from './payments.dtos';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly ps: PaymentsService) {}

  @Get('status/:id')
  public getDisbursementStatus(@Param() params: GetPayPalOrderDetailsDto) {
    // return this.ps.getOrderDetails(params.id);
    return this.ps.serializeOrder(params.id);
  }
}
