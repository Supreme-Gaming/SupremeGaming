import { Queue, Worker, ConnectionOptions } from 'bullmq';
import { Socket } from 'socket.io-client';
import { buildRegistrationPayload } from '@supremegaming/agent';

const QUEUE_NAME = 'host-agent-heartbeat';
const SCHEDULER_ID = 'heartbeat';
const HEARTBEAT_INTERVAL_MS = 5000;

export async function startHeartbeatScheduler(
  socket: Socket,
  key: string,
  connection: ConnectionOptions
): Promise<{ queue: Queue; worker: Worker }> {
  const queue = new Queue(QUEUE_NAME, { connection });

  const worker = new Worker(
    QUEUE_NAME,
    async () => {
      const payload = await buildRegistrationPayload(key);
      socket.emit('heartbeat', payload);
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[agent] Heartbeat job ${job?.id} failed:`, err.message);
  });

  await queue.upsertJobScheduler(SCHEDULER_ID, { every: HEARTBEAT_INTERVAL_MS }, { name: 'heartbeat' });

  console.log(`[agent] Heartbeat scheduler started (every ${HEARTBEAT_INTERVAL_MS}ms)`);

  return { queue, worker };
}

export async function stopHeartbeatScheduler(queue: Queue, worker: Worker): Promise<void> {
  await worker.close();
  await queue.close();
  console.log('[agent] Heartbeat scheduler stopped');
}
