import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { AuthModuleOptions, OPTIONS } from '../types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(OPTIONS) options: AuthModuleOptions) {
    super(options.jwtStrategy);
  }

  async validate(payload) {
    return payload;
  }
}
