import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@supremegaming/common/entities/administration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SteamStrategy } from './strategies/steam.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthModuleOptions, OPTIONS } from './types/types';

@Module({})
export class AuthModule {
  public static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtModule.register(options.jwt)],
      controllers: [AuthController],
      providers: [
        AuthService,
        SteamStrategy,
        JwtStrategy,
        {
          provide: OPTIONS,
          useValue: options,
        },
      ],
      exports: [PassportModule, JwtModule],
    };
  }
}
