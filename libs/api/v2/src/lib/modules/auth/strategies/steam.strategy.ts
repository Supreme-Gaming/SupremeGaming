import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resolver } from 'dns/promises';

import * as ST from 'passport-steam';

import { User } from '@supremegaming/common/entities/administration';

import { AuthModuleOptions, ISteamProfile, OPTIONS } from '../types/types';

async function lookupPublicIpv4(timeoutMs = 5000): Promise<string> {
  const resolver = new Resolver();
  resolver.setServers(['208.67.222.222', '208.67.220.220']);

  let timer: NodeJS.Timeout | undefined;
  try {
    const addresses = await Promise.race([
      resolver.resolve4('myip.opendns.com'),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Public IP lookup timed out')), timeoutMs);
      }),
    ]);
    const address = addresses[0];
    if (!address) {
      throw new Error('Public IP lookup returned no address');
    }
    return address;
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

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

    const ip = await lookupPublicIpv4();

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
