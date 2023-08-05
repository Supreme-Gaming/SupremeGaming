// import { AuthModule, HostsModule, ServersModule } from '@supremegaming/api/v2';
// import { authOptions } from '../environments/environment';

// AuthModule.forRoot(authOptions),
// TODO: ServersModule and HostsModule are part of V2 API and not ready for use yet.
// ServersModule,
// HostsModule,

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DonationEntity, PlayerEntity, UserEntity } from '@supremegaming/common/entities/v1';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const administrationDb = TypeOrmModule.forRoot({
  name: 'default',
  type: process.env.PAYMENTS_DB_TYPE,
  host: process.env.PAYMENTS_DB_HOST,
  port: parseInt(process.env.PAYMENTS_DB_PORT, 10),
  username: process.env.PAYMENTS_DB_USERNAME,
  password: process.env.PAYMENTS_DB_PASSWORD,
  database: process.env.PAYMENTS_DB_DATABASE,
  synchronize: process.env.PAYMENTS_DB_SYNCHRONIZE === 'true',
  dropSchema: process.env.PAYMENTS_DB_DROP_SCHEMA === 'true',
  logging: process.env.PAYMENTS_DB_LOGGING === 'true',
  extra: process.env.PAYMENTS_DB_EXTRA,
  entities: [DonationEntity, UserEntity],
} as TypeOrmModuleOptions);

const rewardsDb = TypeOrmModule.forRoot({
  name: 'rewards',
  type: process.env.REWARDS_DB_TYPE,
  host: process.env.REWARDS_DB_HOST,
  port: parseInt(process.env.REWARDS_DB_PORT, 10),
  username: process.env.REWARDS_DB_USERNAME,
  password: process.env.REWARDS_DB_PASSWORD,
  database: process.env.REWARDS_DB_DATABASE,
  synchronize: process.env.REWARDS_DB_SYNCHRONIZE === 'true',
  dropSchema: process.env.REWARDS_DB_DROP_SCHEMA === 'true',
  logging: process.env.REWARDS_DB_LOGGING === 'true',
  extra: process.env.REWARDS_DB_EXTRA,
  entities: [PlayerEntity],
} as TypeOrmModuleOptions);

@Module({
  imports: [administrationDb, rewardsDb],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
