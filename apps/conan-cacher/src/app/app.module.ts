import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LitePlayer, LiteTribe } from '@supremegaming/common/entities/conan';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { dbConfig } from '../environments/environment';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbConfig,
      entities: [LitePlayer, LiteTribe],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
