import { Socket } from 'socket.io-client';

import { AGENT_SOCKET_EVENTS, type AgentHostConfiguration } from '@supremegaming/agent/core';

import { JobManager } from '../jobs/manager';

export function attachConfigurationHandler(socket: Socket, jobManager: JobManager): void {
  socket.on(AGENT_SOCKET_EVENTS.CONFIGURATION, (configuration: AgentHostConfiguration) => {
    void applyHostConfiguration(configuration, jobManager).catch((err) => {
      console.error('[agent] Failed to apply host configuration:', err);
    });
  });
}

export async function applyHostConfiguration(
  configuration: AgentHostConfiguration,
  jobManager: JobManager
): Promise<void> {
  console.log(
    `[agent] Received configuration for host ${configuration.hostId} (${configuration.servers.length} game server(s))`
  );

  await jobManager.applyConfiguration(configuration);
}
