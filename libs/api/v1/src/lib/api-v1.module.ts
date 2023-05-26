import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiCoreModule } from '@supremegaming/api/core';

import { DonationEntity, PlayerEntity, EventEntity } from '@supremegaming/common/entities/v1';
import { PaymentsController } from './modules/payments/payments.controller';

import { PaymentsModule } from './modules/payments/payments.module';
import { PaymentsService } from './modules/payments/payments.service';

@Module({
  imports: [ApiCoreModule, PaymentsModule, TypeOrmModule.forFeature([DonationEntity, PlayerEntity, EventEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [],
})
export class ApiV1Module {}
