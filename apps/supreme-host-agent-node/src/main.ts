import { io, Socket } from 'socket.io-client';
import { Queue, Worker } from 'bullmq';

import {
  AgentCredentialManager,
  JobManager,
  attachCommandHandlers,
  attachConfigurationHandler,
  buildRegistrationPayload,
  createHostAgentJobsQueue,
  createHostAgentJobsWorker,
  gameDataIntervalMs,
  startHeartbeatScheduler,
  stopHeartbeatScheduler,
} from '@supremegaming/agent/host';

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
  let jobsWorker: Worker | null = null;

  const credManager = new AgentCredentialManager(apiUrl, agentId);
  await credManager.init();

  const jobsQueue = createHostAgentJobsQueue(redisConnection);
  const jobManager = new JobManager({
    queue: jobsQueue,
    apiUrl,
    getAccessToken: () => credManager.getAccessToken(),
    intervalMs: gameDataIntervalMs(),
  });

  const socketOpts: Record<string, unknown> = {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    auth: {
      token: credManager.getAccessToken(),
      agentId,
    },
  };

  const socketOrigin = new URL(apiUrl).origin;
  const socket: Socket = io(`${socketOrigin}/hosts`, socketOpts);
  attachCommandHandlers(socket, jobManager);
  attachConfigurationHandler(socket, jobManager);

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

    if (jobsWorker) {
      await jobsWorker.close();
    }

    jobsWorker = createHostAgentJobsWorker(redisConnection, (job) => jobManager.processJob(job));
    
    jobsWorker.on('failed', (job, err) => {
      console.error(`[agent] Job ${job?.id} failed:`, err.message);
    });

    console.log('[agent] Game-data jobs worker started');
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

    if (jobsWorker) {
      await jobsWorker.close();
      jobsWorker = null;
      console.log('[agent] Game-data jobs worker stopped');
    }
  });

  socket.on('connect_error', async (err) => {
    console.error('[agent] Connection error:', err.message);

    if (err.message === 'invalid_token') {
      try {
        console.log('[agent] Refreshing access token...');
        await credManager.refresh();
        socket.auth = { token: credManager.getAccessToken(), agentId };
      } catch (refreshErr) {
        console.error('[agent] Token refresh failed:', refreshErr);
      }
    }
  });
})();
