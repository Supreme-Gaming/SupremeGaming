import { Body, Controller, Get, Post } from '@nestjs/common';

import { PostCapturePaymentDto } from './payments.dtos';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly ps: PaymentsService) {}

  @Get('status')
  public getDisbursementStatus() {
    return 'capture';
  }

  @Post('capture')
  public selfPaymentCapture(@Body() body: PostCapturePaymentDto) {
    return this.ps.capturePayment();
  }
}
