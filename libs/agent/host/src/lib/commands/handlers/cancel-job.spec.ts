import { AGENT_COMMAND_TYPES, AGENT_JOB_TYPES, type AgentCommandProgress } from '@supremegaming/agent/core';

import { JobManager } from '../../jobs/manager';
import { cancelJobHandler } from './cancel-job';

describe('cancelJobHandler', () => {
  const issuedAt = '2026-08-23T07:00:00.000Z';
  const jobs = {
    cancelCollectGameData: jest.fn(),
  };
  const jobManager = jobs as unknown as JobManager;
  const reports: AgentCommandProgress[] = [];
  const report = (update: Partial<AgentCommandProgress>) => {
    reports.push({
      requestId: 'req-cancel',
      status: update.status ?? 'running',
      timestamp: issuedAt,
      ...update,
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    reports.length = 0;
    jobs.cancelCollectGameData.mockResolvedValue(undefined);
  });

  it('cancels collect-game-data and reports success', async () => {
    await cancelJobHandler(jobManager)(
      {
        requestId: 'req-cancel',
        type: AGENT_COMMAND_TYPES.CANCEL_JOB,
        payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: 'gs-1' },
        issuedAt,
      },
      report
    );

    expect(jobs.cancelCollectGameData).toHaveBeenCalledWith('gs-1');
    expect(reports).toEqual([
      expect.objectContaining({
        status: 'succeeded',
        data: { serverId: 'gs-1', cancelled: true },
      }),
    ]);
  });

  it('rejects unknown jobs', async () => {
    await expect(
      cancelJobHandler(jobManager)(
        {
          requestId: 'req-cancel',
          type: AGENT_COMMAND_TYPES.CANCEL_JOB,
          payload: { job: 'something-else', serverId: 'gs-1' },
          issuedAt,
        },
        report
      )
    ).rejects.toMatchObject({ code: 'unknown_job' });
    expect(jobs.cancelCollectGameData).not.toHaveBeenCalled();
  });

  it('requires payload.serverId', async () => {
    await expect(
      cancelJobHandler(jobManager)(
        {
          requestId: 'req-cancel',
          type: AGENT_COMMAND_TYPES.CANCEL_JOB,
          payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: '' },
          issuedAt,
        },
        report
      )
    ).rejects.toMatchObject({ code: 'invalid_payload' });
    expect(jobs.cancelCollectGameData).not.toHaveBeenCalled();
  });
});
