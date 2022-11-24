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
} from 'libs/discord/community/src';

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
  modules: [
    ArkInfoDiscordModule,
    AtlasInfoDiscordModule,
    ConanInfoDiscordModule,
    DonateDiscordModule,
    FunDiscordModule,
    GeneralHelpDiscordModule,
    NewMemberDiscordModule,
    RoleAssignmentDiscordModule,
  ],
  options: {
    clientToken: process.env.DISCORD_API_TOKEN,
    clientId: process.env.DISCORD_BOT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  },
});
