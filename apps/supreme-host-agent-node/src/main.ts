import { buildRegistrationPayload } from '@supremegaming/agent';

(async () => {
  const key = process.env.AGENT_KEY;
  if (!key) {
    console.error('[agent] AGENT_KEY environment variable is required');
    process.exit(1);
  }

  try {
    const payload = await buildRegistrationPayload(key);
    console.log(JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error('[agent] Registration failed:', err);
    process.exit(1);
  }
})();
