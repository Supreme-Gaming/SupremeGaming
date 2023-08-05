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

// Auth module options injection token
export const OPTIONS = 'OPTIONS';

export interface ISteamProfile {
  _json: ISteamProfileJson;
  displayName: string;
  id: string;
  provider: string;
}

export interface ISteamProfileJson {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  communityvisibilitystate: number;
  lastlogoff: number;
  loccountrycode: string;
  locstatecode: string;
  personaname: string;
  personastate: boolean;
  personastateflags: boolean;
  primaryclanid: string;
  profilestate: number;
  profileurl: string;
  realname: string;
  steamid: string;
}
