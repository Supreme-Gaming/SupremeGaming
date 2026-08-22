import { Socket } from 'socket.io-client';
import { AGENT_SOCKET_EVENTS, type AgentHostConfiguration } from '@supremegaming/agent';

export function attachConfigurationHandler(socket: Socket): void {
  socket.on(AGENT_SOCKET_EVENTS.CONFIGURATION, (configuration: AgentHostConfiguration) => {
    void applyHostConfiguration(configuration).catch((err) => {
      console.error('[agent] Failed to apply host configuration:', err);
    });
  });
}

export async function applyHostConfiguration(configuration: AgentHostConfiguration): Promise<void> {
  console.log(
    `[agent] Received configuration for host ${configuration.hostId} (${configuration.servers.length} game server(s))`
  );

  for (const server of configuration.servers) {
    console.log(`[agent] Game server ${JSON.stringify(server)}`);
  }
}
