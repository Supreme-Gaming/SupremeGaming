import { Module } from '@nestjs/common';

import { PaypalRestService } from './services/paypal-rest/paypal-rest.service';

@Module({
  controllers: [],
  providers: [PaypalRestService],
  exports: [],
})
export class ApiCoreModule {}
