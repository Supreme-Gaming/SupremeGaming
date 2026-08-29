import { existsSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';
import { Worker } from 'worker_threads';

import { AGENT_GAME_TYPES, type GameDataPlayer, type GameDataSnapshot, type GameDataTribe } from '@supremegaming/agent/core';

type ArkPlayerRecord = Partial<GameDataPlayer> & { Tribe?: unknown };
type ArkTribeRecord = Partial<GameDataTribe> & { Players?: unknown };

type ArkFilesConstructor = {
  new (
    arkServerDir: string,
    refreshInterval?: number | null,
    format?: string,
    absolutePath?: boolean
  ): {
    getPlayers(): unknown[];
    getTribes(): unknown[];
  };
  ArkBinaryFormats: { ASE: string; ASA: string };
};

function loadArkFiles(): ArkFilesConstructor {
  return createRequire(__filename)('@supremegaming/ark-files') as ArkFilesConstructor;
}

export function flattenArkPlayer(player: ArkPlayerRecord): GameDataPlayer {
  return {
    PlayerName: player.PlayerName ?? '',
    Level: player.Level ?? 0,
    TotalEngramPoints: player.TotalEngramPoints ?? 0,
    CharacterName: player.CharacterName ?? '',
    TribeId: player.TribeId ?? false,
    EosId: player.EosId,
    PlayerId: player.PlayerId ?? 0,
    FileCreated: player.FileCreated ?? '',
    FileUpdated: player.FileUpdated ?? '',
  };
}

export function flattenArkTribe(tribe: ArkTribeRecord): GameDataTribe {
  return {
    Name: tribe.Name ?? '',
    OwnerId: tribe.OwnerId ?? 0,
    Id: tribe.Id ?? 0,
    TribeLogs: tribe.TribeLogs ?? [],
    TribeMemberNames: tribe.TribeMemberNames ?? [],
    FileCreated: tribe.FileCreated ?? '',
    FileUpdated: tribe.FileUpdated ?? '',
  };
}

export function parseArkAscendedGameData(serverDirectory: string): GameDataSnapshot {
  const ArkFilesCtor = loadArkFiles();
  const { ArkBinaryFormats } = ArkFilesCtor;
  const arkFiles = new ArkFilesCtor(serverDirectory, 0, ArkBinaryFormats.ASA, true);
  const players = ((arkFiles.getPlayers() as ArkPlayerRecord[]) ?? []).map(flattenArkPlayer);
  const tribes = ((arkFiles.getTribes() as ArkTribeRecord[]) ?? []).map(flattenArkTribe);

  console.log(`Received ${players.length} players and ${tribes.length} tribes`);

  return {
    game: AGENT_GAME_TYPES.ARK_ASCENDED,
    collectedAt: new Date().toISOString(),
    players,
    tribes,
  };
}

export function resolveArkAscendedWorkerFilename(): string {
  const candidates = [
    join(__dirname, 'ark-ascended.worker.js'),
    join(__dirname, 'jobs/collect-game-data/ark-ascended.worker.js'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[candidates.length - 1];
}

export function runArkAscendedParse(serverDirectory: string): { worker: Worker; result: Promise<GameDataSnapshot> } {
  const worker = new Worker(resolveArkAscendedWorkerFilename(), {
    workerData: { serverDirectory },
  });

  const result = new Promise<GameDataSnapshot>((resolve, reject) => {
    worker.once('message', (snapshot: GameDataSnapshot) => resolve(snapshot));
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`ark-ascended worker exited with code ${code}`));
      }
    });
  });

  return { worker, result };
}
