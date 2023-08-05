import { Module } from '@nestjs/common';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { AuthModule, HostsModule, ServersModule } from '@supremegaming/api/v2';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { authOptions } from '../environments/environment';

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
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
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
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
} as TypeOrmModuleOptions);

@Module({
  imports: [
    administrationDb,
    rewardsDb,

    // AuthModule.forRoot(authOptions),
    // TODO: ServersModule and HostsModule are part of V2 API and not ready for use yet.
    // ServersModule,
    // HostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
