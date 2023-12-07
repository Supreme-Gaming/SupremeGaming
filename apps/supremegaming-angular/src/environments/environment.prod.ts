import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { servers } from './servers';

export const environment: SupremeGamingEnvironment = {
  production: false,
  servers,
  legacyApiUrl: 'https://supremegaming.gg/api',
  v1ApiUrl: 'https://supremegaming.gg/api/v1',
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
