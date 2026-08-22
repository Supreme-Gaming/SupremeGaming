import { AGENT_SOCKET_EVENTS } from '@supremegaming/agent';

import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentsService } from '../agents/agents.service';
import { AgentCommandsService } from './agent-commands.service';
import { AgentSocketBridge } from './agent-socket.bridge';
import { ServersService } from '../servers/servers.service';

describe('HostsGateway', () => {
  const hostId = '507f191e810c19729de860ea';
  const configuration = {
    hostId,
    servers: [
      {
        _id: '507f1f77bcf86cd799439011',
        host: hostId,
        port: 7777,
        rconport: 27020,
        rconpass: 'secret',
        game: 'ark',
        shouldProcess: false,
      },
    ],
  };

  const hostsService = {
    getHostByAgentId: jest.fn(),
    registerHost: jest.fn(),
    processHeartbeat: jest.fn(),
    setHostOffline: jest.fn(),
  };
  const agentsService = {
    verifyAccessToken: jest.fn(),
  };
  const commandsService = {
    recordProgress: jest.fn(),
  };
  const socketBridge = {
    attach: jest.fn(),
  };
  const serversService = {
    getAgentConfiguration: jest.fn(),
  };

  let gateway: HostsGateway;

  beforeEach(() => {
    jest.resetAllMocks();
    gateway = new HostsGateway(
      hostsService as unknown as HostsService,
      agentsService as unknown as AgentsService,
      commandsService as unknown as AgentCommandsService,
      socketBridge as unknown as AgentSocketBridge,
      serversService as unknown as ServersService
    );
  });

  describe('handleConnection', () => {
    it('emits configuration when the connecting agent has a host', async () => {
      hostsService.getHostByAgentId.mockResolvedValue({ _id: hostId });
      serversService.getAgentConfiguration.mockResolvedValue(configuration);
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleConnection(client as never);

      expect(client.join).toHaveBeenCalledWith('agent:agent-1');
      expect(hostsService.getHostByAgentId).toHaveBeenCalledWith('agent-1');
      expect(serversService.getAgentConfiguration).toHaveBeenCalledWith(hostId);
      expect(client.emit).toHaveBeenCalledWith(AGENT_SOCKET_EVENTS.CONFIGURATION, configuration);
    });

    it('does not emit when there is no host record yet', async () => {
      hostsService.getHostByAgentId.mockResolvedValue(null);
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleConnection(client as never);

      expect(serversService.getAgentConfiguration).not.toHaveBeenCalled();
      expect(client.emit).not.toHaveBeenCalled();
    });

    it('does not look up configuration for unauthenticated clients', async () => {
      const client = {
        id: 'sock-1',
        data: {},
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleConnection(client as never);

      expect(hostsService.getHostByAgentId).not.toHaveBeenCalled();
      expect(client.emit).not.toHaveBeenCalled();
    });

    it('keeps the socket open when configuration lookup fails', async () => {
      hostsService.getHostByAgentId.mockRejectedValue(new Error('db down'));
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await expect(gateway.handleConnection(client as never)).resolves.toBeUndefined();
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleRegister', () => {
    it('emits configuration after the host is registered', async () => {
      hostsService.registerHost.mockResolvedValue({ _id: hostId, status: 'ready' });
      serversService.getAgentConfiguration.mockResolvedValue(configuration);
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleRegister(
        { key: 'agent-1', hostname: 'box', system: {}, timestamp: new Date().toISOString() },
        client as never
      );

      expect(client.emit).toHaveBeenCalledWith('registered', {
        success: true,
        hostId,
        status: 'ready',
      });
      expect(serversService.getAgentConfiguration).toHaveBeenCalledWith(hostId);
      expect(client.emit).toHaveBeenCalledWith(AGENT_SOCKET_EVENTS.CONFIGURATION, configuration);
    });
  });
});
