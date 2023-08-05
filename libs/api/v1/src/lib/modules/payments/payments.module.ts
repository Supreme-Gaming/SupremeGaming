import { Module } from '@nestjs/common';

import { ApiCoreModule } from '@supremegaming/api/core';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [ApiCoreModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
