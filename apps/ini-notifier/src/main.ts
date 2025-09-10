// Load env variables early
import 'dotenv/config';

import { getConfig } from './config';
import { IniCache } from './services/cache';
import { Poller } from './jobs/poller';

(async () => {
  const config = getConfig();
  const cache = new IniCache();

  const poller = new Poller(config, cache);
  await poller.start();

  const stop = async () => {
    await poller.stop();
    process.exit(0);
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})();
