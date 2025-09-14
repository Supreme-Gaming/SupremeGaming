export interface AppConfig {
  iniUrl: string;
  discordWebhookUrl: string;
  pollIntervalMs: number;
  requestTimeoutMs: number;
  notifierName: string;
  notifyOnInitial: boolean;
}

export function getConfig(): AppConfig {
  const iniUrl = process.env.INI_URL;
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!iniUrl) {
    throw new Error('INI_URL is required');
  }
  if (!discordWebhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL is required');
  }

  const pollIntervalMs = parseInt(process.env.POLL_INTERVAL_MS || '', 10) || 60_000;
  const requestTimeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS || '', 10) || 15_000;
  const notifierName = process.env.NOTIFIER_NAME || 'ini-notifier-node';
  const notifyOnInitial = toBool(process.env.NOTIFY_ON_INITIAL);

  return {
    iniUrl,
    discordWebhookUrl,
    pollIntervalMs,
    requestTimeoutMs,
    notifierName,
    notifyOnInitial,
  };
}

function toBool(v?: string): boolean {
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}
