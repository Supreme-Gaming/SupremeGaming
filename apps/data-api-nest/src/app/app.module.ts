import { Module } from '@nestjs/common';

import { AuthModule, HostsModule, ServersModule } from '@supremegaming/api';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authOptions, ormconfig } from '../environments/environment';

@Module({
  imports: [...ormconfig, AuthModule.forRoot(authOptions), ServersModule, HostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
