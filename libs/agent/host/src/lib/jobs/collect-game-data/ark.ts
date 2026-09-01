import { existsSync } from 'fs';
import { join } from 'path';
import { Worker } from 'worker_threads';

import { AGENT_GAME_TYPES, type GameDataPlayer, type GameDataSnapshot, type GameDataTribe } from '@supremegaming/agent/core';
import ArkFiles from '@supremegaming/ark-files';

type ArkPlayerRecord = Omit<Partial<GameDataPlayer>, 'SteamId'> & { Tribe?: unknown; SteamId?: string | number };
type ArkTribeRecord = Partial<GameDataTribe> & { Players?: unknown };

type ArkBinaryFormats = { ASE: string; ASA: string };

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
  ArkBinaryFormats: ArkBinaryFormats;
};

function loadArkFiles(): ArkFilesConstructor {
  return ArkFiles as unknown as ArkFilesConstructor;
}

export function flattenArkPlayer(player: ArkPlayerRecord): GameDataPlayer {
  return {
    PlayerName: player.PlayerName ?? '',
    Level: player.Level ?? 0,
    TotalEngramPoints: player.TotalEngramPoints ?? 0,
    CharacterName: player.CharacterName ?? '',
    TribeId: player.TribeId ?? false,
    EosId: player.EosId,
    SteamId: player.SteamId != null ? String(player.SteamId) : undefined,
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

export function arkBinaryFormatForGame(game: string, formats: ArkBinaryFormats): string {
  switch (game) {
    case AGENT_GAME_TYPES.ARK_ASCENDED:
      return formats.ASA;
    case AGENT_GAME_TYPES.ARK_EVOLVED:
      return formats.ASE;
    default:
      throw new Error(`Unsupported ARK game '${game}'`);
  }
}

export function parseArkGameData(serverDirectory: string, game: string): GameDataSnapshot {
  const ArkFilesCtor = loadArkFiles();
  const { ArkBinaryFormats } = ArkFilesCtor;
  const arkFiles = new ArkFilesCtor(serverDirectory, 0, arkBinaryFormatForGame(game, ArkBinaryFormats), true);
  const players = ((arkFiles.getPlayers() as ArkPlayerRecord[]) ?? []).map(flattenArkPlayer);
  const tribes = ((arkFiles.getTribes() as ArkTribeRecord[]) ?? []).map(flattenArkTribe);

  console.log(`Received ${players.length} players and ${tribes.length} tribes`);

  return {
    game,
    collectedAt: new Date().toISOString(),
    players,
    tribes,
  };
}

export function resolveArkWorkerFilename(): string {
  const candidates = [
    join(__dirname, 'ark.worker.js'),
    join(__dirname, 'jobs/collect-game-data/ark.worker.js'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[candidates.length - 1];
}

export function runArkParse(
  serverDirectory: string,
  game: string
): { worker: Worker; result: Promise<GameDataSnapshot> } {
  const worker = new Worker(resolveArkWorkerFilename(), {
    workerData: { serverDirectory, game },
  });

  const result = new Promise<GameDataSnapshot>((resolve, reject) => {
    worker.once('message', (snapshot: GameDataSnapshot) => resolve(snapshot));
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`ark worker exited with code ${code}`));
      }
    });
  });

  return { worker, result };
}
