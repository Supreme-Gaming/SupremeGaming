This NestJS app is the HTTP + Socket.IO control plane (`data-api-nest`). It mounts `@supremegaming/api/v2`, including host-agent presence and command delivery.

Agents connect to Socket.IO namespace `/hosts` on this process (not under the REST global prefix, default `/api`). The Web UI must not reach agents; it calls this API, which emits to room `agent:{agentId}`.

Command HTTP surface (see [`libs/api/v2/README.md`](../../libs/api/v2/README.md)):

- `POST /api/hosts/:agentId/commands`
- `GET /api/hosts/:agentId/commands/:requestId`
- `GET /api/hosts/:agentId/commands/:requestId/events` (SSE)

Machine auth for agents uses `MACHINE_JWT_SECRET`. If that env var is unset, gateway auth middleware is disabled (dev only).

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
