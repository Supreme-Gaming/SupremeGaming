import {
  Message,
  TextChannel,
  Collection,
  CategoryChannel,
  CacheType,
  Interaction,
  CommandInteraction,
  ButtonInteraction,
  OverwriteResolvable,
  APIEmbed,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
  User,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  ContextMenuCommandInteraction,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
  TextBasedChannel,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { createConnection, ConnectionOptionsReader } from 'typeorm';

import {
  ContextMenus,
  ContextMenuTypes,
  OnInteractionCreate,
  OnMessageCreate,
  OnMessageDelete,
  OnMessageUpdate,
  SlashCommands,
  SlashCommandTypes,
} from '@supremegaming/discord/bootstrap';

import { TicketServerConfiguration } from './features/discord-server-configuration.feature';
import { Ticket } from './features/discord-tickets.feature';
import { TicketMessage } from './features/discord-ticket-message.feature';
import { Dialog } from './features/dialog.feature';

import { CCC_INSTRUCTIONS_TEMPLATE } from '@supremegaming/discord/templates';
import { TicketEntity } from './entities/ticket.entity';
import { TicketAttachment } from './entities/ticket-attachment.entity';
import { TicketConfiguration } from './entities/ticket-configuration.entity';
import { TicketMessageEntity } from './entities/ticket-message.entity';

export class TicketClient
  implements SlashCommands, ContextMenus, OnMessageCreate, OnMessageUpdate, OnMessageDelete, OnInteractionCreate
{
  constructor() {
    this.connect();
  }

  public connect() {
    const connectionOptionsReader = new ConnectionOptionsReader();
    connectionOptionsReader.get('default').then((connectionOptions) => {
      createConnection({
        ...connectionOptions,
        entities: [TicketEntity, TicketAttachment, TicketConfiguration, TicketMessageEntity],
      });
    });
  }

  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Commands for creating or managing the support ticket platform on this server.')
        .addStringOption((option) => {
          return option
            .setName('action')
            .setDescription('Select a ticket action.')
            .setRequired(true)
            .addChoices(
              { name: 'New ticket', value: 'new' },
              { name: 'Close ticket', value: 'close' },
              { name: 'Add user to ticket', value: 'add' },
              { name: 'Remove user from ticket', value: 'remove' }
            );
        }),
    ];
  }

  public contextMenus(): ContextMenuTypes {
    return [
      new ContextMenuCommandBuilder()
        .setName('Remove from ticket')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
      new ContextMenuCommandBuilder()
        .setName('Add to ticket')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    ];
  }

  public clientOnMessageCreate(message: Message<boolean>): void | Promise<void> {
    // Creates a ticket message object and checks if the message was made inside a ticket channel before proceeding.
    new TicketMessage(message, 'create').init();
  }

  public clientOnMessageUpdate(oldMessage: Message<boolean>, newMessage: Message<boolean>): void | Promise<void> {
    new TicketMessage(newMessage, 'edit').init();
  }

  public clientOnMessageDelete(message: Message<boolean>): void | Promise<void> {
    new TicketMessage(message, 'delete').init();
  }

  public async clientOnInteractionCreate(interaction: Interaction<CacheType>): Promise<void> {
    // Handle component commands
    if (interaction.isButton() && interaction.isMessageComponent()) {
      const channel = (await interaction.channel.fetch()) as TextChannel;
      const message = ((await interaction.channel) as TextChannel).messages.fetch(interaction.message.id);

      // Only try to handle ticket-related actions.
      if (this.isEventInTicketChannel(channel)) {
        if (interaction.customId === 'ticket_close_button') {
          await this.closeTicketChannel(interaction);
        } else if (interaction.customId === 'ticket_dismiss_button') {
          (await message).delete();
        } else if (interaction.customId === 'ccc_print_button') {
          interaction.reply(CCC_INSTRUCTIONS_TEMPLATE);
        }
      }
    }
    // Handle slash commands
    else if (interaction.isCommand() && interaction.commandName === 'ticket') {
      // TODO: validate
      switch (interaction.options.get('action').value) {
        case 'new':
          await this.createTicket(interaction);
          break;
        case 'close':
          await this.closeTicketPrompt(interaction);
          break;
        case 'add':
          await this.promptUserAdd(interaction);
          break;
        case 'remove':
          await this.promptUserRemove(interaction);
          break;
        default:
          break;
      }
    } else if (interaction.isUserSelectMenu()) {
      if (interaction.customId === 'user_select_add') {
        const [selectedId] = interaction.values;

        const t = interaction.members.at(0);
        const name = (t.user as User).globalName;

        await this.addMemberToTicket(interaction, selectedId, name);
      } else if (interaction.customId === 'user_select_remove') {
        const [selectedId] = interaction.values;

        const t = interaction.members.at(0);
        const name = (t.user as User).globalName;

        await this.removeMemberFromTicket(interaction, selectedId, name);
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_select_add') {
        interaction;

        const [channelId, userId, userName] = interaction.values[0].split('-');

        await this.addMemberToTicketFromList(interaction, channelId, userId, userName);
      }
    } else if (interaction.isUserContextMenuCommand()) {
      if (interaction.commandName === 'Add to ticket') {
        const selectedId = interaction.targetId;

        const t = interaction.targetMember;
        const name = (t.user as User).globalName;

        await this.promptChannelList(interaction, selectedId, name);
      } else if (interaction.commandName === 'Remove from ticket') {
        const selectedId = interaction.targetId;

        const t = interaction.targetMember;
        const name = (t.user as User).globalName;

        await this.removeMemberFromTicket(interaction, selectedId, name);
      }
    }
  }

  private async setup(message: Message) {
    // Ticket configurations are stored by discord guild ID.
    const serverId = message.guild.id;

    const config = await new TicketServerConfiguration(serverId).fetch();

    if (config.fromDb) {
      this.processExistingSetup(message, config);
    } else {
      this.processNewSetup(message, config);
    }
  }

  private async processNewSetup(message: Message, config: TicketServerConfiguration) {
    try {
      const promptCategoryEmbed: APIEmbed = {
        title: 'Where should I make tickets?',
        description: `In order to keep things neat and tidy, all tickets and transcripts will be created under a Discord category.
      
      Please provide a category name. If it doesn't yet exist, I'll take care of setting that up.`,
        color: 0x69f0ae,
      };

      const channel = message.channel as TextChannel;

      channel.send({ embeds: [promptCategoryEmbed] });

      const botFilter = (captured: Message) => captured.content && !captured.author.bot;

      // Wait for user entry. Filter out bot messages.
      const categoryCapture = await channel.awaitMessages({
        filter: botFilter,
        max: 1,
        time: 30000,
        errors: ['time'],
      });

      config.category = categoryCapture;

      channel.send(`Got it. Category will be \`${config.value.category}\`. Next question...`);

      const promptNotifyRole: APIEmbed = {
        title: 'Who should I ping when a new ticket is made?',
        description: `Please mention/tag the role that I should @ when a new ticket is created.\n\nThis can be set to \`Admin\`, \`Support Staff\`, \`@everyone\`, or any other role that exists on this server.`,
        color: 0x69f0ae,
      };

      channel.send({ embeds: [promptNotifyRole] });

      // Wait for user entry. Filter out bot messages.
      const notifyRoleCapture = await channel.awaitMessages({
        filter: botFilter,
        max: 1,
        time: 30000,
        errors: ['time'],
      });

      config.notifyRole = notifyRoleCapture;
      channel.send(`Beep Boop! I will notify \`${config.value.notifyRole}\` every time a new ticket is created.`);

      await config.save();

      let categoryChannel = message.guild.channels.cache.find((channel) => {
        return channel.type === ChannelType.GuildCategory && channel.name === config.value.category;
      });

      const everyoneRole = message.guild.roles.cache.find((role) => role.name === '@everyone');

      if (!categoryChannel) {
        // Make the ticket channel category with default permissions that will apply to all future
        // created tickets.
        categoryChannel = (await message.guild.channels.create({
          name: config.value.category,
          type: ChannelType.GuildCategory,
          reason: 'Category for all future tickets.',
          permissionOverwrites: [
            {
              id: everyoneRole,
              allow: ['ReadMessageHistory'],
              deny: ['SendMessages', 'ViewChannel'],
            },
          ],
        })) as CategoryChannel;
      }

      // Check for an existing ticket log channel.
      let ticketLogChannel = message.guild.channels.cache.find(
        (channel) => channel.type === ChannelType.GuildText && channel.name === 'ticket-logs'
      );

      if (!ticketLogChannel) {
        ticketLogChannel = (await message.guild.channels.create({
          name: 'ticket-logs',
          type: ChannelType.GuildText,
          reason: 'Channel to log all closed tickets.',
          parent: categoryChannel.id,
        })) as TextChannel;
      }

      // Confirmation message
      channel.send(`All done! I've created a ${config.value.category} channel category and a #ticket-logs channel. For the sake of your puny human memory, I'll be posting there when a ticket is closed.
      `);
    } catch (err) {
      // Differentiate between message capture timeouts vs others.
      if (err instanceof Collection) {
        (message.channel as TextChannel).send(`Setup timeout. Setup has been cancelled.`);
      } else {
        throw new Error(err.message);
      }
    }
  }

  private async processExistingSetup(message: Message, config: TicketServerConfiguration) {
    new Dialog(message.channel as TextChannel, [
      {
        prompt: {
          type: 'rich-embed',
          options: {
            title: 'Existing Server Ticket Configuration',
            description: 'It appears this server has already been configured. Do you want to modify the existing settings?',
            color: 0x69f0ae,
          },
        },
        collect: {
          value: {
            target: 'cleanContent',
            transformation: function (m) {
              return m[this.target].toLowerCase();
            },
          },
          actions: [
            {
              accept: ['yes'],
              action: function (m) {
                console.log('Will do something with YES');
                return m.cleanContent.toUpperCase();
              },
              next: {
                prompt: function (a: string) {
                  return {
                    type: 'plain-text',
                    content: `The thing you just typed is "${a}". \n\n This serves as confirmation.`,
                  };
                },
              },
            },
            {
              accept: ['no'],
              next: {
                prompt: {
                  type: 'plain-text',
                  content: 'Ok, no settings for u.',
                },
              },
            },
          ],
        },
        wait: 10,
      },
    ]);
  }

  private async createTicket(interaction: CommandInteraction<CacheType>) {
    if ((<TextChannel>interaction.channel).name.startsWith(`ticket-`))
      return interaction.reply({
        content: `You can't use this command inside of a ticket channel.`,
        ephemeral: true,
      });

    let ticket = undefined;
    try {
      // Get ticket server configuration.
      // This will contain channel category to add ticket to and
      // role to tag on ticket creation.
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();

      if (!config.fromDb) {
        interaction.reply('Ticket service not configured. Type `!ticket setup` to setup the service.');

        return;
      }

      // Dry-initialize ticket which collects the server sequence number used as the ticket channel name
      ticket = await new Ticket(interaction).init();

      const parentCategory = interaction.guild.channels.cache.find(
        (channel) => channel.name === config.value.category && channel.type == ChannelType.GuildCategory
      ) as CategoryChannel;

      const everyoneRole = interaction.guild.roles.cache.find((role) => role.name === '@everyone');

      // Create channel with ticket record count and leading 0 padding to 4 digits.
      const ticketChannel = (await interaction.guild.channels.create({
        name: ticket.channelName,
        type: ChannelType.GuildText,
        parent: parentCategory,
        permissionOverwrites: [
          this.getTicketReaderPermissionResolvable(interaction.user.id),
          {
            id: everyoneRole,
            deny: ['SendMessages', 'ReadMessageHistory', 'ViewChannel'],
          },
        ],
      })) as TextChannel;

      ticket.channelId = ticketChannel.id;

      // From the server configuration, get the role that should be notified about the new ticket
      const notifyRole = interaction.guild.roles.cache.find((role) => role.name == config.value.notifyRole);

      // Send confirmation message and link to created channel.
      interaction.reply({
        content: `:white_check_mark: Your ticket has been created, <#${ticketChannel.id}>.\n\nPlease follow the channel link and provide details there. Tickets without any additional information will be removed.`,
        ephemeral: true,
      });

      const ticketCreateEmbed: APIEmbed = {
        title: 'Ticket Instructions',
        description: `Thanks <@!${interaction.user.id}>! So that we can better assist, please describe the reason for the ticket:\n\n**Example**:\n\n- Game the issue is on: (Ark, Atlas or Conan)\n- The server or grid your issue is on: (eg. Ark Island, Atlas F9, Conan AoC)\n- A detailed description of your issue: (gimme the deets)\n\nIf this ticket is in regards to on-location assistance in-game, please provide the \`ccc\` coordinates. \n\nAn <@&${notifyRole.id}> will attend to this ticket as soon as one is available.\n\nBelow you'll find a couple of buttons for common tasks, including closing the ticket which can be done at any point in time.`,
      };

      const close = new ButtonBuilder()
        .setLabel('Close ticket')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('ticket_close_button')
        .setEmoji('<a:NeonCheck:647830043304919062>');

      const print = new ButtonBuilder()
        .setLabel('Print instructions for getting ccc coordinates')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('ccc_print_button')
        .setEmoji('<a:cli:748801664714276914>');

      await ticketChannel.send({
        embeds: [ticketCreateEmbed],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [close, print],
          },
        ],
      });

      // Insert ticket to DB last, once discord stuff has been taken care of an no errors ocurred.
      await ticket.create();
    } catch (err) {
      if (ticket && ticket.isCreated) {
        await ticket.delete();
      }
      console.log(err);
    }
  }

  /**
   * Returns a permissions overwrite object for a user.
   *
   * This resolvable is used to give the provided userId basic access to a ticket channel.
   */
  private getTicketReaderPermissionResolvable(userId: string): OverwriteResolvable {
    return {
      id: userId,
      allow: ['SendMessages', 'ReadMessageHistory', 'AttachFiles', 'ViewChannel'],
    };
  }

  private async closeTicketPrompt(interaction: CommandInteraction<CacheType>) {
    if (!this.isEventInTicketChannel(interaction.channel as TextChannel)) {
      this.sendOutsideTicketChannelMessage(interaction);
      return;
    }

    const close = new ButtonBuilder()
      .setLabel('Close ticket')
      .setStyle(ButtonStyle.Danger)
      .setCustomId('ticket_close_button')
      .setEmoji('<a:NeonCheck:647830043304919062>');

    const dismiss = new ButtonBuilder()
      .setLabel("Go away, I'm not done yet")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('ticket_dismiss_button')
      .setEmoji('<a:NO:647830054797312028>');

    await interaction.reply({
      content: `If there's nothing else we can help you with, please close this ticket.`,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [close, dismiss],
        },
      ],
    });
  }

  private isEventInTicketChannel(channel: TextChannel) {
    return channel.name.startsWith(`ticket-`);
  }

  private sendOutsideTicketChannelMessage(interaction: CommandInteraction<CacheType>) {
    interaction.reply({
      content: `You can't use this command outside of a ticket channel.`,
      ephemeral: true,
    });
  }

  private async closeTicketChannel(interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>) {
    const existingTicket = await new Ticket(interaction).init();

    const logChannel = interaction.guild.channels.cache.find((c) => {
      return c.name === 'ticket-logs';
    }) as TextChannel;

    const ticketName = (interaction.channel as TextChannel).name.split('-')[1];

    await interaction.channel.delete();
    await existingTicket.close();

    // Send close confirmation to logs channel.
    return logChannel.send(`Ticket ${ticketName} was closed by ${interaction.user.username}`);
  }

  private async promptUserAdd(interaction: CommandInteraction<CacheType>) {
    if (this.isEventInTicketChannel(interaction.channel as TextChannel) === false) {
      this.sendOutsideTicketChannelMessage(interaction);
    }

    const members = new UserSelectMenuBuilder().setCustomId('user_select_add').setPlaceholder('Select member from list');

    interaction.reply({
      content: 'Select the user to add to this ticket',
      components: [{ type: ComponentType.ActionRow, components: [members] }],
      ephemeral: true,
    });
  }

  private async promptUserRemove(interaction: CommandInteraction<CacheType>) {
    if (this.isEventInTicketChannel(interaction.channel as TextChannel) === false) {
      this.sendOutsideTicketChannelMessage(interaction);
    }

    const members = new UserSelectMenuBuilder().setCustomId('user_select_remove').setPlaceholder('Select member from list');

    interaction.reply({
      content: 'Select the user to remove from this ticket',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [members],
        },
      ],
      ephemeral: true,
    });
  }

  private async promptChannelList(interaction: CommandInteraction<CacheType>, targetId: string, name: string) {
    const ticket_channels = interaction.guild.channels.cache.filter((channel) => {
      return channel.name.startsWith('ticket-');
    });

    const channelSelect = new StringSelectMenuBuilder()
      .setCustomId('ticket_select_add')
      .setPlaceholder('Select channel from list')
      .addOptions(
        ticket_channels.map((channel) =>
          new StringSelectMenuOptionBuilder().setLabel(channel.name).setValue(`${channel.id}-${targetId}-${name}`)
        )
      );

    interaction.reply({
      content: 'Select the channel to add this user to',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [channelSelect],
        },
      ],
      ephemeral: true,
    });
  }

  private async addMemberToTicket(interaction: UserSelectMenuInteraction<CacheType>, selectedId: string, name: string) {
    try {
      await (interaction.channel as TextChannel).permissionOverwrites.create(selectedId, {
        ReadMessageHistory: true,
        SendMessages: true,
        AttachFiles: true,
        ViewChannel: true,
      });

      await interaction.update({
        content: `Added ${name} to ticket. They can now see and reply to this channel.`,
        components: [],
      });
    } catch (err) {
      return interaction.update({
        content: `Failed to add ${name} to channel. ${err.message}`,
      });
    }
  }

  private async addMemberToTicketFromList(
    interaction: StringSelectMenuInteraction,
    channelId: string,
    userId: string,
    name: string
  ) {
    try {
      const channel = (await interaction.guild.channels.fetch(channelId)) as TextChannel;

      channel.permissionOverwrites.create(userId, {
        ReadMessageHistory: true,
        SendMessages: true,
        AttachFiles: true,
        ViewChannel: true,
      });

      await interaction.update({
        content: `Added ${name} to ticket. They can now see and reply to this channel.`,
        components: [],
      });
    } catch (err) {
      interaction.update({
        content: `Failed to add ${name} to channel. ${err.message}`,
      });
    }
  }

  private async removeMemberFromTicket(
    interaction: UserSelectMenuInteraction<CacheType> | ContextMenuCommandInteraction,
    selectedId: string,
    name: string
  ) {
    await (interaction.channel as TextChannel).permissionOverwrites.delete(selectedId);

    if (interaction.isContextMenuCommand()) {
      try {
        await interaction.reply({
          content: `${name} has been removed from this ticket. They can no longer see or send messages on this channel.`,
          ephemeral: true,
        });
      } catch (err) {
        return interaction.reply({
          content: `Failed to remove ${name} from channel. ${err.message}`,
          ephemeral: true,
        });
      }
    } else if (interaction.isAnySelectMenu()) {
      try {
        await interaction.update({
          content: `${name} has been removed from this ticket. They can no longer see or send messages on this channel.`,
        });
      } catch (err) {
        return interaction.update({
          content: `Failed to remove ${name} from channel. ${err.message}`,
        });
      }
    }
  }
}
