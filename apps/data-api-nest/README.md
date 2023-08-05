## Required configuration

In `src/environments/secrets.ts` the following `jwt`, `jwtStrategy` and `steamStrategy` properties are required.

```js
import { AuthModuleOptions } from '@supremegaming/api/v2';
import { ExtractJwt } from 'passport-jwt';

export const authOptions: AuthModuleOptions = {
  jwt: {
    secret: 'secretkey',
    signOptions: {
      expiresIn: '60s',
    },
  },
  jwtStrategy: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: 'secretkey',
  },
  steamStrategy: {
    returnURL: 'https://domain.com/auth/steam/return',
    realm: 'https://domain.com/',
    apiKey: 'steamApiKey',
  },
};
```

You can get a Steam API key from here:

https://steamcommunity.com/dev/apikey

### Implementation

These options are exported from an applications environment file and passed into the `AuthModule` dynamic module's `forRoot()` options.

```js
import { Module } from '@nestjs/common';

import { authOptions } from '../environments/environment';

@Module({
  imports: [AuthModule.forRoot(authOptions)],
})
export class AppModule {}
```
