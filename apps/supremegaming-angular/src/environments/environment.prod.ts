import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { servers } from './servers';

export const environment: SupremeGamingEnvironment = {
  production: false,
  servers,
  legacyApiUrl: '___LEGACY_API_URL___',
  v2ApiUrl: '___V2_API_URL___',
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
