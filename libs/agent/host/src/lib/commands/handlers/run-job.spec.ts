import { AGENT_COMMAND_TYPES, AGENT_JOB_TYPES, type AgentCommandProgress } from '@supremegaming/agent/core';

import { JobManager } from '../../jobs/manager';
import { runJobHandler } from './run-job';

describe('runJobHandler', () => {
  const issuedAt = '2026-08-23T07:00:00.000Z';
  const jobs = {
    runCollectGameData: jest.fn(),
  };
  const jobManager = jobs as unknown as JobManager;
  const reports: AgentCommandProgress[] = [];
  const report = (update: Partial<AgentCommandProgress>) => {
    reports.push({
      requestId: 'req-run',
      status: update.status ?? 'running',
      timestamp: issuedAt,
      ...update,
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    reports.length = 0;
    jobs.runCollectGameData.mockResolvedValue({
      serverId: 'gs-1',
      game: 'ark-ascended',
      playerCount: 2,
      tribeCount: 1,
      collectedAt: issuedAt,
    });
  });

  it('runs collect-game-data and reports the summary', async () => {
    await runJobHandler(jobManager)(
      {
        requestId: 'req-run',
        type: AGENT_COMMAND_TYPES.RUN_JOB,
        payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: 'gs-1' },
        issuedAt,
      },
      report
    );

    expect(jobs.runCollectGameData).toHaveBeenCalledWith('gs-1', { requestId: 'req-run' });
    expect(reports).toEqual([
      expect.objectContaining({
        status: 'succeeded',
        data: {
          serverId: 'gs-1',
          game: 'ark-ascended',
          playerCount: 2,
          tribeCount: 1,
          collectedAt: issuedAt,
        },
      }),
    ]);
  });

  it('rejects unknown jobs', async () => {
    await expect(
      runJobHandler(jobManager)(
        {
          requestId: 'req-run',
          type: AGENT_COMMAND_TYPES.RUN_JOB,
          payload: { job: 'something-else', serverId: 'gs-1' },
          issuedAt,
        },
        report
      )
    ).rejects.toMatchObject({ code: 'unknown_job' });
    expect(jobs.runCollectGameData).not.toHaveBeenCalled();
  });

  it('requires payload.serverId', async () => {
    await expect(
      runJobHandler(jobManager)(
        {
          requestId: 'req-run',
          type: AGENT_COMMAND_TYPES.RUN_JOB,
          payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: '' },
          issuedAt,
        },
        report
      )
    ).rejects.toMatchObject({ code: 'invalid_payload' });
    expect(jobs.runCollectGameData).not.toHaveBeenCalled();
  });
});
