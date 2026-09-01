import axios from 'axios';

import type { GameDataSnapshot } from '@supremegaming/agent/core';

export async function uploadGameDataSnapshot(
  apiUrl: string,
  accessToken: string,
  serverId: string,
  snapshot: GameDataSnapshot
): Promise<void> {
  try {
    await axios.post(`${apiUrl}/servers/${serverId}/game-data`, snapshot, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        `Game data upload failed: ${err.response?.status ?? 'network'} ${JSON.stringify(err.response?.data ?? err.message)}`
      );
    }
    throw err;
  }
}
