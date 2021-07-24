import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@supremegaming/api';

// import { config } from '../environments/ormconfig';
import { authOptions } from '../environments/environment';

@Module({
  // imports: [TypeOrmModule.forRoot(config), AuthModule],
  imports: [AuthModule.forRoot(authOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
