import { AGENT_COMMAND_TYPES, AGENT_JOB_TYPES, AGENT_SOCKET_EVENTS, type AgentCommand, type AgentCommandProgress } from '@supremegaming/agent/core';

import { JobManager } from '../jobs/manager';
import { attachCommandHandlers } from './commands';

describe('attachCommandHandlers', () => {
  const issuedAt = '2026-08-23T07:00:00.000Z';
  const jobManager = {
    runCollectGameData: jest.fn(),
    cancelCollectGameData: jest.fn(),
    setProgressEmitter: jest.fn(),
  };

  let listeners: Map<string, (command: AgentCommand) => void>;
  let emitted: AgentCommandProgress[];

  beforeEach(() => {
    jest.resetAllMocks();
    listeners = new Map();
    emitted = [];
    const socket = {
      on: jest.fn((event: string, handler: (command: AgentCommand) => void) => {
        listeners.set(event, handler);
      }),
      emit: jest.fn((_event: string, progress: AgentCommandProgress) => {
        emitted.push(progress);
      }),
    };

    attachCommandHandlers(socket as never, jobManager as unknown as JobManager);
  });

  it('registers run-job and dispatches collect-game-data to the job manager', async () => {
    jobManager.runCollectGameData.mockResolvedValue({
      serverId: 'gs-1',
      game: 'ark-ascended',
      playerCount: 2,
      tribeCount: 1,
      collectedAt: issuedAt,
    });

    const handler = listeners.get(AGENT_SOCKET_EVENTS.COMMAND);
    expect(handler).toBeDefined();
    expect(jobManager.setProgressEmitter).toHaveBeenCalled();

    await handler?.({
      requestId: 'req-run',
      type: AGENT_COMMAND_TYPES.RUN_JOB,
      payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: 'gs-1' },
      issuedAt,
    });
    await Promise.resolve();

    expect(jobManager.runCollectGameData).toHaveBeenCalledWith('gs-1', { requestId: 'req-run' });
    expect(emitted.map((event) => event.status)).toEqual(['accepted', 'running', 'succeeded']);
    expect(emitted[2].data).toEqual({
      serverId: 'gs-1',
      game: 'ark-ascended',
      playerCount: 2,
      tribeCount: 1,
      collectedAt: issuedAt,
    });
  });

  it('registers cancel-job and asks the job manager to cancel', async () => {
    jobManager.cancelCollectGameData.mockResolvedValue(undefined);

    const handler = listeners.get(AGENT_SOCKET_EVENTS.COMMAND);
    await handler?.({
      requestId: 'req-cancel',
      type: AGENT_COMMAND_TYPES.CANCEL_JOB,
      payload: { job: AGENT_JOB_TYPES.COLLECT_GAME_DATA, serverId: 'gs-1' },
      issuedAt,
    });
    await Promise.resolve();

    expect(jobManager.cancelCollectGameData).toHaveBeenCalledWith('gs-1');
    expect(emitted.map((event) => event.status)).toContain('succeeded');
    expect(emitted[emitted.length - 1].data).toEqual({ serverId: 'gs-1', cancelled: true });
  });
});
