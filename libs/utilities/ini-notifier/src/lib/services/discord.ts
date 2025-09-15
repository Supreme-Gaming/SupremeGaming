import axios from 'axios';
import { IniChange } from './diff';

export async function sendChangeWebhook(
  webhookUrl: string,
  notifierName: string,
  changes: IniChange[],
  embedTitle: string,
  embedColor: number
) {
  if (!changes.length) return;

  const contentLines = changes.slice(0, 50).map((c) => {
    const render = (v: unknown) => (v === undefined ? 'undefined' : `\`${String(v)}\``);
    if (c.type === 'added') return `**${c.key}**: ${render(c.newValue)}`;
    if (c.type === 'removed') return `**${c.key}**: ~~${render(c.oldValue)}~~`;
    return `**${c.key}: ${render(c.oldValue)} → ${render(c.newValue)}**`;
  });

  const embed = {
    title: embedTitle,
    description: contentLines.length > 0 ? contentLines.join('\n') + '\n\n' : 'No changes.',
    color: embedColor,
    fields: [
      {
        name: '',
        value:
          'This notifier is open source - [View on GitHub](https://github.com/Supreme-Gaming/SupremeGaming/blob/development/apps/ini-notifier-node/README.md)',
        inline: true,
      },
    ],
  };

  const payload = {
    username: notifierName,
    embeds: [embed],
  };

  const res = await axios.post(webhookUrl, payload, {
    headers: { 'Content-Type': 'application/json' },
    validateStatus: () => true,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Discord webhook failed: ${res.status} ${res.statusText}`);
  }
}
