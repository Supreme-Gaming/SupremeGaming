import { DiscordClientBootstrapper } from '@supremegaming/discord/bootstrap';
import {
  ArkInfoDiscordModule,
  AtlasInfoDiscordModule,
  ConanInfoDiscordModule,
  DonateDiscordModule,
  FunDiscordModule,
  GeneralHelpDiscordModule,
  NewMemberDiscordModule,
  RoleAssignmentDiscordModule,
} from '@supremegaming/discord/community';
import { HoneypotDiscordModule } from '@supremegaming/discord/honeypot';
import { GatewayIntentBits, Partials } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mysql from 'mysql';

if (
  process.env.DISCORD_API_TOKEN === undefined ||
  process.env.DISCORD_BOT_ID === undefined ||
  process.env.DISCORD_GUILD_ID === undefined ||
  process.env.DISCORD_ROLE_CHANNEL_NAME === undefined ||
  process.env.DISCORD_WELCOME_CHANNEL_NAME === undefined
) {
  console.error('Missing DISCORD_ environment variables');
  process.exit(1);
}

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

new DiscordClientBootstrapper({
  client: {
    partials: [Partials.Reaction, Partials.Message, Partials.User],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildModeration,
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
  modules: [
    ArkInfoDiscordModule,
    AtlasInfoDiscordModule,
    ConanInfoDiscordModule,
    DonateDiscordModule,
    FunDiscordModule,
    GeneralHelpDiscordModule,
    NewMemberDiscordModule,
    RoleAssignmentDiscordModule,
    HoneypotDiscordModule,
  ],
  options: {
    clientToken: process.env.DISCORD_API_TOKEN,
    clientId: process.env.DISCORD_BOT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  },
});
