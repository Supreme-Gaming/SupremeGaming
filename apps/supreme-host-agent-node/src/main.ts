import { io, Socket } from 'socket.io-client';
import { Queue, Worker } from 'bullmq';
import { buildRegistrationPayload } from '@supremegaming/agent';
import { startHeartbeatScheduler, stopHeartbeatScheduler } from './heartbeat';
import { AgentCredentialManager } from './credential-manager';
import { attachCommandHandlers } from './commands';

(async () => {
  const agentId = process.env.AGENT_ID || process.env.AGENT_KEY;
  const apiUrl = process.env.API_URL;
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

  if (!agentId) {
    console.error('[agent] AGENT_ID (or AGENT_KEY) environment variable is required');
    process.exit(1);
  }

  if (!apiUrl) {
    console.error('[agent] API_URL environment variable is required');
    process.exit(1);
  }

  const redisConnection = { host: redisHost, port: redisPort };
  let heartbeat: { queue: Queue; worker: Worker } | null = null;

  // Initialize credential manager and authenticate
  const credManager = new AgentCredentialManager(apiUrl, agentId);
  await credManager.init();

  // Build Socket.IO connection options
  const socketOpts: Record<string, any> = {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    auth: {
      token: credManager.getAccessToken(),
      agentId,
    },
  };

  // Socket.IO namespaces are not under the REST prefix (/api).
  const socketOrigin = new URL(apiUrl).origin;
  const socket: Socket = io(`${socketOrigin}/hosts`, socketOpts);
  attachCommandHandlers(socket);

  socket.on('connect', async () => {
    console.log(`[agent] Connected to server (socket id: ${socket.id})`);

    try {
      const payload = await buildRegistrationPayload(agentId);
      socket.emit('register', payload);
    } catch (err) {
      console.error('[agent] Failed to build registration payload:', err);
    }
  });

  socket.on('registered', async (data) => {
    console.log('[agent] Registration acknowledged:', data);

    if (heartbeat) {
      await stopHeartbeatScheduler(heartbeat.queue, heartbeat.worker);
    }

    heartbeat = await startHeartbeatScheduler(socket, agentId, redisConnection);
  });

  socket.on('heartbeat-ack', (data) => {
    console.log('[agent] Heartbeat acknowledged:', data.timestamp);
  });

  socket.on('disconnect', async (reason) => {
    console.warn(`[agent] Disconnected: ${reason}`);

    if (heartbeat) {
      await stopHeartbeatScheduler(heartbeat.queue, heartbeat.worker);
      heartbeat = null;
    }
  });

  socket.on('connect_error', async (err) => {
    console.error('[agent] Connection error:', err.message);

    // If the server rejected us for invalid token, refresh and retry
    if (err.message === 'invalid_token') {
      try {
        console.log('[agent] Refreshing access token...');
        await credManager.refresh();
        // Update the auth payload for the next reconnection attempt
        socket.auth = { token: credManager.getAccessToken(), agentId };
      } catch (refreshErr) {
        console.error('[agent] Token refresh failed:', refreshErr);
      }
    }
  });
})();
