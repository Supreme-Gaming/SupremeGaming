import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { AGENT_SOCKET_EVENTS } from '@supremegaming/agent';

import { AgentCommandsService } from './agent-commands.service';
import { AgentSocketBridge } from './agent-socket.bridge';
import { HostsService } from './hosts.service';

describe('AgentCommandsService', () => {
  const hostsService = {
    getHostByAgentId: jest.fn(),
  };
  const bridge = {
    connectedCount: jest.fn(),
    emitToAgent: jest.fn(),
  };

  let service: AgentCommandsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AgentCommandsService(
      hostsService as unknown as HostsService,
      bridge as unknown as AgentSocketBridge
    );
  });

  it('rejects commands for unknown agents', async () => {
    hostsService.getHostByAgentId.mockResolvedValue(null);

    await expect(service.issue('missing', { type: 'list-directory', payload: { path: '/' } })).rejects.toBeInstanceOf(
      NotFoundException
    );
    expect(bridge.emitToAgent).not.toHaveBeenCalled();
  });

  it('rejects commands when the agent is not connected', async () => {
    hostsService.getHostByAgentId.mockResolvedValue({ key: 'agent-1' });
    bridge.connectedCount.mockResolvedValue(0);

    await expect(
      service.issue('agent-1', { type: 'list-directory', payload: { path: '/' } })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(bridge.emitToAgent).not.toHaveBeenCalled();
  });

  it('emits a command to the agent room and returns a queued snapshot', async () => {
    hostsService.getHostByAgentId.mockResolvedValue({ key: 'agent-1' });
    bridge.connectedCount.mockResolvedValue(1);

    const issued = await service.issue('agent-1', { type: 'list-directory', payload: { path: '/tmp' } });

    expect(issued.agentId).toBe('agent-1');
    expect(issued.type).toBe('list-directory');
    expect(issued.result.status).toBe('queued');
    expect(bridge.emitToAgent).toHaveBeenCalledWith(
      'agent-1',
      AGENT_SOCKET_EVENTS.COMMAND,
      expect.objectContaining({
        requestId: issued.requestId,
        type: 'list-directory',
        payload: { path: '/tmp' },
      })
    );
  });

  it('waits for terminal progress when wait=true', async () => {
    hostsService.getHostByAgentId.mockResolvedValue({ key: 'agent-1' });
    bridge.connectedCount.mockResolvedValue(1);
    bridge.emitToAgent.mockImplementation((_agentId: string, _event: string, command: { requestId: string }) => {
      setTimeout(() => {
        service.recordProgress('agent-1', {
          requestId: command.requestId,
          status: 'succeeded',
          data: { ok: true },
          timestamp: new Date().toISOString(),
        });
      }, 10);
    });

    const issued = await service.issue(
      'agent-1',
      { type: 'list-directory', payload: { path: '/tmp' } },
      { wait: true, timeoutMs: 1000 }
    );

    expect(issued.timedOut).toBeUndefined();
    expect(issued.result.status).toBe('succeeded');
    expect(issued.result.data).toEqual({ ok: true });
  });

  it('ignores progress from a different agent', async () => {
    hostsService.getHostByAgentId.mockResolvedValue({ key: 'agent-1' });
    bridge.connectedCount.mockResolvedValue(1);

    const issued = await service.issue('agent-1', { type: 'list-directory' });
    service.recordProgress('agent-2', {
      requestId: issued.requestId,
      status: 'succeeded',
      timestamp: new Date().toISOString(),
    });

    expect(service.getCommand('agent-1', issued.requestId).result.status).toBe('queued');
  });
});
