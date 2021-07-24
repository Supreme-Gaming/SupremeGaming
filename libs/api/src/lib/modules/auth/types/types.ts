import { JwtModuleOptions } from '@nestjs/jwt';
import { StrategyOptions } from 'passport-jwt';

export interface AuthModuleOptions {
  jwt: JwtModuleOptions;
  jwtStrategy: StrategyOptions;
  steamStrategy: {
    returnURL: string;
    realm: string;
    apiKey: string;
  };
}

export const OPTIONS = 'OPTIONS';
