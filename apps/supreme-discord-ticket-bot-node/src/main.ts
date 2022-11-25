import { DiscordClientBootstrapper } from '@supremegaming/discord/bootstrap';
import { TicketClient } from '@supremegaming/discord/ticket';

// The following import is here only because it needs to be imported so that it can be bundled
// else it will be tree shaken out of the bundle
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mysql from 'mysql';

if (
  process.env.TYPEORM_CONNECTION === undefined ||
  process.env.TYPEORM_HOST === undefined ||
  process.env.TYPEORM_PORT === undefined ||
  process.env.TYPEORM_USERNAME === undefined ||
  process.env.TYPEORM_PASSWORD === undefined ||
  process.env.TYPEORM_DATABASE === undefined
) {
  console.error('Missing TYPEORM_ environment variables');
  process.exit(1);
}

if (
  process.env.DISCORD_API_TOKEN === undefined ||
  process.env.DISCORD_GUILD_ID === undefined ||
  process.env.DISCORD_BOT_ID === undefined
) {
  console.error('Missing DISCORD_ environment variables');
  process.exit(1);
}

const bs = new DiscordClientBootstrapper({
  client: {
    partials: ['REACTION', 'MESSAGE', 'USER'],
    intents: [
      'GUILDS',
      'GUILD_BANS',
      'GUILD_EMOJIS_AND_STICKERS',
      'GUILD_INTEGRATIONS',
      'GUILD_INVITES',
      'GUILD_MEMBERS',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGE_TYPING',
      'GUILD_PRESENCES',
      'GUILD_SCHEDULED_EVENTS',
      'GUILD_VOICE_STATES',
      'GUILD_WEBHOOKS',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
    ],
  },
  modules: [TicketClient],
  options: {
    guildId: process.env.DISCORD_GUILD_ID,
    clientToken: process.env.DISCORD_API_TOKEN,
    clientId: process.env.DISCORD_BOT_ID,
  },
});
