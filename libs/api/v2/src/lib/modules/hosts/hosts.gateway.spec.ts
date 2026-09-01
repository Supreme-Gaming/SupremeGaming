import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentsService } from '../agents/agents.service';
import { AgentCommandsService } from './agent-commands.service';
import { AgentSocketBridge } from './agent-socket.bridge';
import { HostConfigurationPublisher } from './host-configuration.publisher';

describe('HostsGateway', () => {
  const hostId = '507f191e810c19729de860ea';

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
  const configurationPublisher = {
    publishToClient: jest.fn(),
  };

  let gateway: HostsGateway;

  beforeEach(() => {
    jest.resetAllMocks();
    gateway = new HostsGateway(
      hostsService as unknown as HostsService,
      agentsService as unknown as AgentsService,
      commandsService as unknown as AgentCommandsService,
      socketBridge as unknown as AgentSocketBridge,
      configurationPublisher as unknown as HostConfigurationPublisher
    );
  });

  describe('handleConnection', () => {
    it('publishes configuration when the connecting agent is authenticated', async () => {
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleConnection(client as never);

      expect(client.join).toHaveBeenCalledWith('agent:agent-1');
      expect(configurationPublisher.publishToClient).toHaveBeenCalledWith(client, 'agent-1', undefined);
    });

    it('does not look up configuration for unauthenticated clients', async () => {
      const client = {
        id: 'sock-1',
        data: {},
        join: jest.fn(),
        emit: jest.fn(),
      };

      await gateway.handleConnection(client as never);

      expect(configurationPublisher.publishToClient).not.toHaveBeenCalled();
      expect(client.emit).not.toHaveBeenCalled();
    });

    it('keeps the socket open when configuration lookup fails', async () => {
      configurationPublisher.publishToClient.mockRejectedValue(new Error('db down'));
      const client = {
        id: 'sock-1',
        data: { agentId: 'agent-1' },
        join: jest.fn(),
        emit: jest.fn(),
      };

      await expect(gateway.handleConnection(client as never)).resolves.toBeUndefined();
    });
  });

  describe('handleRegister', () => {
    it('publishes configuration after the host is registered', async () => {
      hostsService.registerHost.mockResolvedValue({ _id: hostId, status: 'ready' });
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
      expect(configurationPublisher.publishToClient).toHaveBeenCalledWith(client, 'agent-1', hostId);
    });
  });
});
