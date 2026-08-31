import { parentPort, workerData } from 'worker_threads';

import { parseArkGameData } from '@supremegaming/agent/host';

const { serverDirectory, game } = (workerData as { serverDirectory?: string; game?: string }) ?? {};

if (!serverDirectory) {
  throw new Error('ark worker requires workerData.serverDirectory');
}

if (!game) {
  throw new Error('ark worker requires workerData.game');
}

parentPort?.postMessage(parseArkGameData(serverDirectory, game));
