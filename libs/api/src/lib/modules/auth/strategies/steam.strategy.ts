import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as ST from 'passport-steam';

import { AuthModuleOptions, OPTIONS } from '../types/types';

const Strategy = ST.Strategy;

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(OPTIONS) private readonly options: AuthModuleOptions) {
    super(options.steamStrategy);
  }

  public async validate(identifier, profile, done) {
    return done(null, profile);
  }
}
