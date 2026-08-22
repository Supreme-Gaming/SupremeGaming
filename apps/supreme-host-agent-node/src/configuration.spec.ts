import { AGENT_SOCKET_EVENTS, type AgentHostConfiguration } from '@supremegaming/agent';

import { applyHostConfiguration, attachConfigurationHandler } from './configuration';

describe('attachConfigurationHandler', () => {
  it('applies configuration when the socket receives it', async () => {
    const listeners = new Map<string, (payload: AgentHostConfiguration) => void>();
    const socket = {
      on: jest.fn((event: string, handler: (payload: AgentHostConfiguration) => void) => {
        listeners.set(event, handler);
      }),
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
          game: 'ark',
          shouldProcess: false,
          server_directory: '/opt/ark',
        },
      ],
    };

    attachConfigurationHandler(socket as never);

    const handler = listeners.get(AGENT_SOCKET_EVENTS.CONFIGURATION);
    expect(handler).toBeDefined();

    const log = jest.spyOn(console, 'log').mockImplementation();
    handler?.(configuration);
    await Promise.resolve();

    expect(log).toHaveBeenCalledWith(expect.stringContaining('host-1'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('gs-1'));
    log.mockRestore();
  });
});

describe('applyHostConfiguration', () => {
  it('logs an empty assignment without throwing', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation();

    await expect(applyHostConfiguration({ hostId: 'host-1', servers: [] })).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('0 game server(s)'));

    log.mockRestore();
  });
});
