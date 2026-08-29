import { AGENT_GAME_TYPES } from '@supremegaming/agent/core';

import { flattenArkPlayer, flattenArkTribe, parseArkAscendedGameData } from './ark-ascended';

jest.mock('@supremegaming/ark-files', () => {
  const getPlayers = jest.fn();
  const getTribes = jest.fn();
  const ArkFilesMock = jest.fn().mockImplementation(() => ({
    getPlayers,
    getTribes,
  }));
  Object.assign(ArkFilesMock, {
    ArkBinaryFormats: { ASA: 'asa', ASE: 'ase' },
    __getPlayers: getPlayers,
    __getTribes: getTribes,
  });
  return ArkFilesMock;
});

const mockedArkFiles = jest.requireMock('@supremegaming/ark-files') as jest.Mock & {
  __getPlayers: jest.Mock;
  __getTribes: jest.Mock;
  ArkBinaryFormats: { ASA: string; ASE: string };
};
const arkFilesMocks = mockedArkFiles;
const { ArkBinaryFormats } = mockedArkFiles;

describe('ark-ascended collector', () => {
  const tribe = {
    Players: [{ PlayerName: 'cycle' }],
    Name: 'Alpha',
    OwnerId: 1,
    Id: 9,
    TribeLogs: ['log'],
    TribeMemberNames: ['Ada'],
    FileCreated: '2026-01-01T00:00:00.000Z',
    FileUpdated: '2026-01-02T00:00:00.000Z',
  };
  const player = {
    Tribe: tribe,
    PlayerName: 'Ada',
    Level: 80,
    TotalEngramPoints: 12,
    CharacterName: 'Ada',
    TribeId: 9,
    EosId: 'eos-1',
    PlayerId: 1001,
    FileCreated: '2026-01-01T00:00:00.000Z',
    FileUpdated: '2026-01-02T00:00:00.000Z',
  };

  beforeEach(() => {
    mockedArkFiles.mockClear();
    arkFilesMocks.__getPlayers.mockReset().mockReturnValue([player]);
    arkFilesMocks.__getTribes.mockReset().mockReturnValue([tribe]);
  });

  it('constructs ArkFiles with a fresh ASA read of the given absolute path', () => {
    parseArkAscendedGameData('/opt/asa');

    expect(mockedArkFiles).toHaveBeenCalledWith('/opt/asa', 0, ArkBinaryFormats.ASA, true);
  });

  it('strips circular Tribe.Players / Player.Tribe graphs', () => {
    const snapshot = parseArkAscendedGameData('/opt/asa');

    expect(snapshot.game).toBe(AGENT_GAME_TYPES.ARK_ASCENDED);
    expect(snapshot.players).toHaveLength(1);
    expect(snapshot.tribes).toHaveLength(1);
    expect(snapshot.players[0]).not.toHaveProperty('Tribe');
    expect(snapshot.tribes[0]).not.toHaveProperty('Players');
    expect(snapshot.players[0]).toEqual({
      PlayerName: 'Ada',
      Level: 80,
      TotalEngramPoints: 12,
      CharacterName: 'Ada',
      TribeId: 9,
      EosId: 'eos-1',
      PlayerId: 1001,
      FileCreated: '2026-01-01T00:00:00.000Z',
      FileUpdated: '2026-01-02T00:00:00.000Z',
    });
    expect(snapshot.tribes[0]).toEqual({
      Name: 'Alpha',
      OwnerId: 1,
      Id: 9,
      TribeLogs: ['log'],
      TribeMemberNames: ['Ada'],
      FileCreated: '2026-01-01T00:00:00.000Z',
      FileUpdated: '2026-01-02T00:00:00.000Z',
    });
  });

  it('omits nested cycles from flatten helpers', () => {
    expect(flattenArkPlayer(player)).not.toHaveProperty('Tribe');
    expect(flattenArkTribe(tribe)).not.toHaveProperty('Players');
  });
});
