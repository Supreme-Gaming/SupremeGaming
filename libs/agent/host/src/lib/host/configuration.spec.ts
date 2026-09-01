import { AGENT_GAME_TYPES, AGENT_SOCKET_EVENTS, type AgentHostConfiguration } from '@supremegaming/agent/core';

import { JobManager } from '../jobs/manager';
import { applyHostConfiguration, attachConfigurationHandler } from './configuration';

describe('attachConfigurationHandler', () => {
  it('applies configuration through the job manager', async () => {
    const listeners = new Map<string, (payload: AgentHostConfiguration) => void>();
    const socket = {
      on: jest.fn((event: string, handler: (payload: AgentHostConfiguration) => void) => {
        listeners.set(event, handler);
      }),
    };
    const jobManager = {
      applyConfiguration: jest.fn().mockResolvedValue(undefined),
    };
    const configuration: AgentHostConfiguration = {
      hostId: 'host-1',
      servers: [
        {
          _id: 'gs-1',
          host: 'host-1',
          port: 7777,
          rconport: 27020,
          rconpass: 'secret',
          game: AGENT_GAME_TYPES.ARK_ASCENDED,
          shouldProcess: true,
          server_directory: '/opt/ark',
        },
      ],
    };

    attachConfigurationHandler(socket as never, jobManager as unknown as JobManager);

    const handler = listeners.get(AGENT_SOCKET_EVENTS.CONFIGURATION);
    expect(handler).toBeDefined();

    const log = jest.spyOn(console, 'log').mockImplementation();
    handler?.(configuration);
    await Promise.resolve();

    expect(jobManager.applyConfiguration).toHaveBeenCalledWith(configuration);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('host-1'));
    log.mockRestore();
  });
});

describe('applyHostConfiguration', () => {
  it('reconciles schedulers via the job manager', async () => {
    const jobManager = {
      applyConfiguration: jest.fn().mockResolvedValue(undefined),
    };
    const log = jest.spyOn(console, 'log').mockImplementation();

    await expect(
      applyHostConfiguration({ hostId: 'host-1', servers: [] }, jobManager as unknown as JobManager)
    ).resolves.toBeUndefined();
    expect(jobManager.applyConfiguration).toHaveBeenCalledWith({ hostId: 'host-1', servers: [] });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('0 game server(s)'));

    log.mockRestore();
  });
});
