import { parentPort, workerData } from 'worker_threads';

import { parseArkAscendedGameData } from '@supremegaming/agent/host';

const serverDirectory = (workerData as { serverDirectory?: string })?.serverDirectory;
if (!serverDirectory) {
  throw new Error('ark-ascended worker requires workerData.serverDirectory');
}

parentPort?.postMessage(parseArkAscendedGameData(serverDirectory));
