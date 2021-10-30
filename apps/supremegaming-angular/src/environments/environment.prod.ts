import { SupremeGamingEnvironment } from '@supremegaming/common/interfaces';
import { servers } from './servers';

export const environment: SupremeGamingEnvironment = {
  production: true,
  servers,
  apiUrl: 'https://supremegaming.gg/api',
  games: {
    atlas: {
      gridImages: 'https://static.supremegaming.gg',
    },
  },
};
