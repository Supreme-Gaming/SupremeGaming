import { AGENT_GAME_TYPES, AGENT_JOB_TYPES, type AgentHostConfiguration } from '@supremegaming/agent/core';

import { isCollectGameDataEligible, JobManager } from './manager';
import { COLLECT_GAME_DATA_JOB, collectGameDataSchedulerId } from './queue';

jest.mock('./collect-game-data/ark-ascended', () => ({
  runArkAscendedParse: jest.fn(),
}));

describe('isCollectGameDataEligible', () => {
  const base = {
    _id: 'gs-1',
    host: 'host-1',
    port: 7777,
    rconport: 27020,
    game: AGENT_GAME_TYPES.ARK_ASCENDED,
    shouldProcess: true,
    server_directory: '/opt/asa',
  };

  it('accepts ark-ascended servers that should process and have a directory', () => {
    expect(isCollectGameDataEligible(base)).toBe(true);
  });

  it('rejects servers that are the wrong game, disabled, or missing a directory', () => {
    expect(isCollectGameDataEligible({ ...base, game: 'ark' })).toBe(false);
    expect(isCollectGameDataEligible({ ...base, shouldProcess: false })).toBe(false);
    expect(isCollectGameDataEligible({ ...base, server_directory: undefined })).toBe(false);
    expect(isCollectGameDataEligible({ ...base, server_directory: '' })).toBe(false);
  });
});

describe('JobManager.applyConfiguration', () => {
  const eligible: AgentHostConfiguration['servers'][number] = {
    _id: 'gs-eligible',
    host: 'host-1',
    port: 7777,
    rconport: 27020,
    game: AGENT_GAME_TYPES.ARK_ASCENDED,
    shouldProcess: true,
    server_directory: '/opt/asa',
  };
  const ineligible: AgentHostConfiguration['servers'][number] = {
    _id: 'gs-off',
    host: 'host-1',
    port: 7778,
    rconport: 27021,
    game: AGENT_GAME_TYPES.ARK_ASCENDED,
    shouldProcess: false,
    server_directory: '/opt/asa-off',
  };

  const queue = {
    getJobSchedulers: jest.fn(),
    removeJobScheduler: jest.fn(),
    upsertJobScheduler: jest.fn(),
  };

  let manager: JobManager;

  beforeEach(() => {
    jest.resetAllMocks();
    queue.getJobSchedulers.mockResolvedValue([]);
    manager = new JobManager({
      queue: queue as never,
      apiUrl: 'http://localhost:3333/api',
      getAccessToken: () => 'token',
      intervalMs: 60_000,
    });
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore?.();
  });

  it('upserts a scheduler for each eligible server', async () => {
    await manager.applyConfiguration({ hostId: 'host-1', servers: [eligible, ineligible] });

    expect(queue.upsertJobScheduler).toHaveBeenCalledTimes(1);
    expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
      collectGameDataSchedulerId('gs-eligible'),
      { every: 60_000 },
      {
        name: COLLECT_GAME_DATA_JOB,
        data: {
          job: AGENT_JOB_TYPES.COLLECT_GAME_DATA,
          serverId: 'gs-eligible',
          game: AGENT_GAME_TYPES.ARK_ASCENDED,
          serverDirectory: '/opt/asa',
          trigger: 'schedule',
        },
      }
    );
    expect(queue.removeJobScheduler).not.toHaveBeenCalled();
  });

  it('removes schedulers for ineligible or removed servers', async () => {
    queue.getJobSchedulers.mockResolvedValue([
      { key: collectGameDataSchedulerId('gs-eligible') },
      { key: collectGameDataSchedulerId('gs-removed') },
      { key: collectGameDataSchedulerId('gs-off') },
    ]);

    await manager.applyConfiguration({
      hostId: 'host-1',
      servers: [{ ...eligible, shouldProcess: false }, ineligible],
    });

    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
    expect(queue.removeJobScheduler).toHaveBeenCalledWith(collectGameDataSchedulerId('gs-eligible'));
    expect(queue.removeJobScheduler).toHaveBeenCalledWith(collectGameDataSchedulerId('gs-removed'));
    expect(queue.removeJobScheduler).toHaveBeenCalledWith(collectGameDataSchedulerId('gs-off'));
  });
});
