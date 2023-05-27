import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaypalRestService } from './services/paypal-rest/paypal-rest.service';
import { LoggerService } from './services/logger/logger.service';

@Module({
  imports: [HttpModule],
  providers: [LoggerService, PaypalRestService],
  exports: [LoggerService, PaypalRestService, HttpModule],
})
export class ApiCoreModule {}
