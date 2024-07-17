import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiCoreModule } from '@supremegaming/api/core';
import { DonationEntity, EventEntity, PlayerEntity } from '@supremegaming/common/entities/v1';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ApiCoreModule,
    TypeOrmModule.forFeature([DonationEntity, EventEntity]),
    TypeOrmModule.forFeature([PlayerEntity], 'rewards'),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
