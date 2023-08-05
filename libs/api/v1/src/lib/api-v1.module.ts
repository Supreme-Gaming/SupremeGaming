import { Module } from '@nestjs/common';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [PaymentsModule],
})
export class ApiV1Module {}
