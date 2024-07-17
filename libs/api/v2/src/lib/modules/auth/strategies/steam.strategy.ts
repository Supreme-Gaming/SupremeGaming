import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as ST from 'passport-steam';
import { v4 } from 'public-ip';

import { User } from '@supremegaming/common/entities/administration';

import { AuthModuleOptions, ISteamProfile, OPTIONS } from '../types/types';

const Strategy = ST.Strategy;

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @Inject(OPTIONS) private readonly options: AuthModuleOptions
  ) {
    super(options.steamStrategy);
  }

  public async validate(identifier, profile: ISteamProfile, done) {
    let user = await this.usersRepo.findOne({
      where: {
        steamid: profile.id,
      },
    });

    const ip = await v4();

    if (user === undefined) {
      user = await this.usersRepo
        .create({
          steamid: profile.id,
          username: profile.displayName,
          lastip: ip,
        })
        .save();
    } else {
      if (user.username !== profile.displayName) {
        user.username = profile.displayName;
        user.lastip = ip;
      } else {
        user.lastip = ip;
      }

      await user.save();
    }
    const built = { ...profile, user };

    return done(null, built);
  }
}
