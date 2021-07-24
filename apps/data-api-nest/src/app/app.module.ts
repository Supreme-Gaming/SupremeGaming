import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule, ServersModule } from '@supremegaming/api';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authOptions, ormconfig } from '../environments/environment';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), AuthModule.forRoot(authOptions), ServersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
