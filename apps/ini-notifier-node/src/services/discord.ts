import axios from 'axios';
import { IniChange } from './diff';

export async function sendChangeWebhook(webhookUrl: string, notifierName: string, changes: IniChange[]) {
  if (!changes.length) return;

  const contentLines = changes.slice(0, 50).map((c) => {
    const render = (v: unknown) => (v === undefined ? 'undefined' : `\`${String(v)}\``);
    if (c.type === 'added') return `➕ ${c.key}: ${render(c.newValue)}`;
    if (c.type === 'removed') return `➖ ${c.key}: ${render(c.oldValue)}`;
    return `✏️ ${c.key}: ${render(c.oldValue)} → ${render(c.newValue)}`;
  });

  const payload = {
    username: notifierName,
    content:
      contentLines.length > 0
        ? `INI changes detected (showing up to 50):\n` + contentLines.join('\n')
        : 'INI changes detected.',
  };

  const res = await axios.post(webhookUrl, payload, {
    headers: { 'Content-Type': 'application/json' },
    validateStatus: () => true,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Discord webhook failed: ${res.status} ${res.statusText}`);
  }
}
