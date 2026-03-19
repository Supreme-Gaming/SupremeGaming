import { io, Socket } from 'socket.io-client';
import { Queue, Worker } from 'bullmq';
import { buildRegistrationPayload } from '@supremegaming/agent';
import { startHeartbeatScheduler, stopHeartbeatScheduler } from './heartbeat';

(async () => {
  const key = process.env.AGENT_KEY;
  const apiUrl = process.env.API_URL;
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

  if (!key) {
    console.error('[agent] AGENT_KEY environment variable is required');
    process.exit(1);
  }

  if (!apiUrl) {
    console.error('[agent] API_URL environment variable is required');
    process.exit(1);
  }

  const redisConnection = { host: redisHost, port: redisPort };
  let heartbeat: { queue: Queue; worker: Worker } | null = null;

  const socket: Socket = io(`${apiUrl}/hosts`, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 3000,
  });

  socket.on('connect', async () => {
    console.log(`[agent] Connected to server (socket id: ${socket.id})`);

    try {
      const payload = await buildRegistrationPayload(key);
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

    heartbeat = await startHeartbeatScheduler(socket, key, redisConnection);
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

  socket.on('connect_error', (err) => {
    console.error('[agent] Connection error:', err.message);
  });
})();
