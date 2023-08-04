import {
  CacheType,
  ContextMenuCommandBuilder,
  GuildMember,
  Interaction,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';

import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';

export abstract class OnReady {
  abstract clientOnReady(): void | Promise<void>;
}

export abstract class OnInteractionCreate {
  abstract clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void>;
}

export abstract class OnGuildMemberAdd {
  abstract clientOnGuildMemberAdd(member: GuildMember): void | Promise<void>;
}

export abstract class OnMessageReactionAdd {
  abstract clientOnMessageReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): void | Promise<void>;
}

export abstract class OnMessageReactionRemove {
  abstract clientOnMessageReactionRemove(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): void | Promise<void>;
}

export abstract class OnMessageCreate {
  abstract clientOnMessageCreate(message: Message): void | Promise<void>;
}

export abstract class OnMessageUpdate {
  abstract clientOnMessageUpdate(
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ): void | Promise<void>;
}

export abstract class OnMessageDelete {
  abstract clientOnMessageDelete(message: Message | PartialMessage): void | Promise<void>;
}

export abstract class OnError {
  abstract clientOnError(error: Error): void | Promise<void>;
}

export abstract class OnWarn {
  abstract clientOnWarn(message: string): void | Promise<void>;
}

export abstract class SlashCommands {
  abstract commands(): SlashCommandTypes;
}

export abstract class ContextMenus {
  abstract contextMenus(): ContextMenuTypes;
}

export interface DiscordFeatureModuleConstructor {
  new (): DiscordFeatureModule;
}

export type SlashCommandTypes = Array<SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | any>;
export type ContextMenuTypes = Array<ContextMenuCommandBuilder | any>;

export class DiscordFeatureModule {
  public commands?(): SlashCommandTypes;

  public contextMenus?(): ContextMenuTypes;

  public clientOnReady?: () => void | Promise<void>;

  public clientOnInteractionCreate?: (interaction: Interaction<CacheType>) => void | Promise<void>;

  public clientOnGuildMemberAdd?: (member: GuildMember) => void | Promise<void>;

  public clientOnMessageReactionAdd?: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => void | Promise<void>;

  public clientOnMessageReactionRemove?: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => void | Promise<void>;

  public clientOnMessageCreate?: (messsage: Message) => void | Promise<void>;

  public clientOnMessageUpdate?: (
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ) => void | Promise<void>;

  public clientOnMessageDelete?: (messsage: Message | PartialMessage) => void | Promise<void>;

  public clientOnError?: (error: Error) => void | Promise<void>;

  public clientOnWarn?: (message: string) => void | Promise<void>;
}
