import { ServiceUnavailableException } from '@nestjs/common';
import { Types } from 'mongoose';

import { AGENT_SOCKET_EVENTS } from '@supremegaming/agent/core';

import { AgentSocketBridge } from './agent-socket.bridge';
import { HostConfigurationPublisher } from './host-configuration.publisher';
import { HostsService } from './hosts.service';

describe('HostConfigurationPublisher', () => {
  const hostId = new Types.ObjectId('507f191e810c19729de860ea');
  const configuration = {
    hostId: String(hostId),
    servers: [{ _id: 'gs-1', game: 'ark-ascended' }],
  };

  const hostsService = {
    getHostById: jest.fn(),
    getHostByAgentId: jest.fn(),
  };
  const socketBridge = {
    emitToAgent: jest.fn(),
  };
  const gsModel = {
    find: jest.fn(),
  };

  let publisher: HostConfigurationPublisher;

  beforeEach(() => {
    jest.resetAllMocks();
    gsModel.find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue(configuration.servers),
      }),
    });
    publisher = new HostConfigurationPublisher(
      hostsService as unknown as HostsService,
      socketBridge as unknown as AgentSocketBridge,
      gsModel as never
    );
  });

  describe('publishToClient', () => {
    it('emits configuration when the agent has a host', async () => {
      hostsService.getHostByAgentId.mockResolvedValue({ _id: hostId });
      const client = { emit: jest.fn() };

      await publisher.publishToClient(client, 'agent-1');

      expect(gsModel.find).toHaveBeenCalledWith({ host: hostId });
      expect(client.emit).toHaveBeenCalledWith(AGENT_SOCKET_EVENTS.CONFIGURATION, configuration);
    });

    it('does not emit when there is no host record', async () => {
      hostsService.getHostByAgentId.mockResolvedValue(null);
      const client = { emit: jest.fn() };

      await publisher.publishToClient(client, 'agent-1');

      expect(gsModel.find).not.toHaveBeenCalled();
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('publishForHost', () => {
    it('emits configuration to the host agent room', async () => {
      hostsService.getHostById.mockResolvedValue({ _id: hostId, agentId: 'agent-1', key: 'legacy' });

      await publisher.publishForHost(hostId);

      expect(socketBridge.emitToAgent).toHaveBeenCalledWith(
        'agent-1',
        AGENT_SOCKET_EVENTS.CONFIGURATION,
        configuration
      );
    });

    it('falls back to host.key when agentId is missing', async () => {
      hostsService.getHostById.mockResolvedValue({ _id: hostId, key: 'legacy-key' });

      await publisher.publishForHost(hostId);

      expect(socketBridge.emitToAgent).toHaveBeenCalledWith(
        'legacy-key',
        AGENT_SOCKET_EVENTS.CONFIGURATION,
        configuration
      );
    });

    it('does not throw when the socket server is not ready', async () => {
      hostsService.getHostById.mockResolvedValue({ _id: hostId, agentId: 'agent-1' });
      socketBridge.emitToAgent.mockImplementation(() => {
        throw new ServiceUnavailableException('Agent socket server is not ready');
      });

      await expect(publisher.publishForHost(hostId)).resolves.toBeUndefined();
    });
  });
});
