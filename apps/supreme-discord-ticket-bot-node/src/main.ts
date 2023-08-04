import { DiscordClientBootstrapper } from '@supremegaming/discord/bootstrap';
import { TicketClient } from '@supremegaming/discord/ticket';
import { GatewayIntentBits, Partials } from 'discord.js';

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

new DiscordClientBootstrapper({
  client: {
    partials: [Partials.Reaction, Partials.Message, Partials.User],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
    ],
  },
  modules: [TicketClient],
  options: {
    guildId: process.env.DISCORD_GUILD_ID,
    clientToken: process.env.DISCORD_API_TOKEN,
    clientId: process.env.DISCORD_BOT_ID,
  },
});
