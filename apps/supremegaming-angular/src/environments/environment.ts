import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { servers } from './servers';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: SupremeGamingEnvironment = {
  production: false,
  servers,
  legacyApiUrl: 'https://supremegaming.gg/api',
  v1ApiUrl: 'http://localhost:3333/api',
  games: {
    atlas: {
      gridImages: 'https://static.supremegaming.gg',
      rewardsUrl: 'https://static.supremegaming.gg/data/atlas/rewards.json',
      rewardsProductImagesUrl: 'https://static.supremegaming.gg/images/atlas/products',
    },
    ark: {
      rewardsUrl: 'https://static.supremegaming.gg/data/ark/rewards.json',
      rewardsProductImagesUrl: 'https://static.supremegaming.gg/images/ark/products',
    },
  },
  paypalClientId: '___PAYPAL_CLIENT_ID___',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
