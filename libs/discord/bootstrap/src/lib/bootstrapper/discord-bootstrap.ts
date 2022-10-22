import {
  CacheType,
  Client,
  ClientOptions,
  GuildMember,
  Interaction,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { DiscordFeatureModule, DiscordFeatureModuleConstructor, SlashCommandTypes } from '../feature-module/feature-module';

export class DiscordClientBootstrapper {
  public client: Client;
  private restClient: REST;

  constructor(options: BootstrapperOptions) {
    this.client = new Client(options.client);

    const slashCommands: SlashCommandTypes = [];

    if (options.modules.length > 0) {
      options.modules.forEach((dm, index, arr) => {
        const moduleInstance: DiscordFeatureModule = new dm();

        if (moduleInstance.commands) {
          slashCommands.push(...moduleInstance.commands());
        }

        if (moduleInstance.clientOnReady) {
          this._onReady(moduleInstance.clientOnReady, moduleInstance);
        }

        if (moduleInstance.clientOnInteractionCreate) {
          this._onInteractionCreate(moduleInstance.clientOnInteractionCreate, moduleInstance);
        }

        if (moduleInstance.clientOnGuildMemberAdd) {
          this._onGuildMemberAdd(moduleInstance.clientOnGuildMemberAdd, moduleInstance);
        }

        if (moduleInstance.clientOnMessageReactionAdd) {
          this._onMessageReactionAdd(moduleInstance.clientOnMessageReactionAdd, moduleInstance);
        }

        if (moduleInstance.clientOnMessageReactionRemove) {
          this._onMessageReactionRemove(moduleInstance.clientOnMessageReactionRemove, moduleInstance);
        }

        if (moduleInstance.clientOnMessageCreate) {
          this._onMessageCreate(moduleInstance.clientOnMessageCreate, moduleInstance);
        }

        if (moduleInstance.clientOnMessageUpdate) {
          this._onMessageUpdate(moduleInstance.clientOnMessageUpdate, moduleInstance);
        }

        if (moduleInstance.clientOnMessageDelete) {
          this._onMessageDelete(moduleInstance.clientOnMessageDelete, moduleInstance);
        }

        // Register slash commands after all module listeners have been initialized.
        if (slashCommands.length > 0 && index === arr.length - 1) {
          this._registerSlashCommands(
            options.options.clientId,
            options.options.guildId,
            options.options.clientToken,
            slashCommands
          );
        }

        console.log(`Loaded ${moduleInstance.constructor.name}.`);

        return this;
      });
    }

    // Call the initial onReady handler to cache guild members
    this._onReady(async () => {
      // Get all guilds for the client
      const guilds = await this.client.guilds;

      console.log(`Caching members for ${guilds.cache.size} guilds...`);

      // For each guild, fetch the members which will cache them.
      guilds.cache.forEach(async (guild) => {
        const resolvedGuild = await guild.fetch();

        const members = await resolvedGuild.members.fetch();

        console.log(`Cached ${members.size} members for ${guild.name} guild!`);
      });

      this.client.user.setActivity('Supreme Gaming');
    });

    // Call the initial warn and error handlers to listen for those events globally
    this._onWarn();
    this._onError();

    this.client.login(options.options.clientToken);
  }

  private _onReady(fn: () => void, ctx?: DiscordFeatureModule) {
    this.client.on('ready', () => {
      fn.apply(ctx);
    });
  }

  private _onInteractionCreate(fn: (interaction: Interaction<CacheType>) => void, ctx?: DiscordFeatureModule) {
    this.client.on('interactionCreate', (i) => {
      fn.apply(ctx, [i]);
    });
  }

  private _onGuildMemberAdd(fn: (member: GuildMember) => void, ctx?: DiscordFeatureModule) {
    this.client.on('guildMemberAdd', (m) => {
      fn.apply(ctx, [m]);
    });
  }

  private _onMessageReactionAdd(
    fn: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => void,
    ctx?: DiscordFeatureModule
  ) {
    this.client.on('messageReactionAdd', (r, u) => {
      fn.apply(ctx, [r, u]);
    });
  }

  private _onMessageReactionRemove(
    fn: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => void,
    ctx?: DiscordFeatureModule
  ) {
    this.client.on('messageReactionRemove', (r, u) => {
      fn.apply(ctx, [r, u]);
    });
  }

  private _onMessageCreate(fn: (message: Message) => void, ctx?: DiscordFeatureModule) {
    this.client.on('messageCreate', (m) => {
      fn.apply(ctx, [m]);
    });
  }

  private _onMessageUpdate(fn: (oldMessage: Message, newMessage: Message) => void, ctx?: DiscordFeatureModule) {
    this.client.on('messageUpdate', (o, n) => {
      fn.apply(ctx, [o as Message, n as Message]);
    });
  }

  private _onMessageDelete(fn: (message: Message) => void, ctx?: DiscordFeatureModule) {
    this.client.on('messageDelete', (m) => {
      fn.apply(ctx, [m as Message]);
    });
  }

  private _onError() {
    this.client.on('error', (error) => {
      console.error(`Bootstrapper module error: `, error.message);
    });
  }

  private _onWarn() {
    this.client.on('warn', (error) => {
      console.warn(`Bootstrapper module warning: `, error);
    });
  }

  private async _registerSlashCommands(clientId: string, guildId: string, clientToken: string, commands: SlashCommandTypes) {
    try {
      this.restClient = new REST({ version: '9' }).setToken(clientToken);

      console.log('Refreshing application (/) commands.');

      // If a guildId is not undefined, then the application is in dev/testing mode and commands should be registered to the guild
      // instead of globally due to global caching propagation delay
      //
      // https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands
      if (guildId) {
        console.log('Clearing guild commands.');
        await this.restClient.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: [],
        });

        console.log('Registering new guild commands.');
        await this.restClient.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: commands.map((c) => c.toJSON()),
        });
      } else {
        console.log('Clearing global commands.');
        await this.restClient.put(Routes.applicationCommands(clientId), {
          body: [],
        });

        console.log('Registering new global commands.');
        await this.restClient.put(Routes.applicationCommands(clientId), {
          body: commands.map((c) => c.toJSON()),
        });
      }

      console.log('Successfully refreshed application (/) commands.');
    } catch (err: any) {
      console.error(err.message);
    }
  }
}

interface BootstrapperOptions {
  client: ClientOptions;
  modules: Array<DiscordFeatureModuleConstructor>;
  options: {
    clientId: string;
    guildId: string;
    clientToken: string;
  };
}
