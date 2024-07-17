import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiCoreModule } from '@supremegaming/api/core';

import { DonationEntity, PlayerEntity, EventEntity } from '@supremegaming/common/entities/v1';

import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ApiCoreModule,
    PaymentsModule,
    TypeOrmModule.forFeature([DonationEntity, EventEntity]),
    TypeOrmModule.forFeature([PlayerEntity], 'rewards'),
  ],
})
export class ApiV1Module {}
