import {
  Message,
  MessageEmbed,
  TextChannel,
  Collection,
  CategoryChannel,
  MessageActionRow,
  MessageButton,
  CacheType,
  Interaction,
  CommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  MessageSelectMenu,
  OverwriteResolvable,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { createConnection } from 'typeorm';

import {
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

import { messages } from '../../templateMessages';

export class TicketClient implements SlashCommands, OnMessageCreate, OnMessageUpdate, OnMessageDelete, OnInteractionCreate {
  constructor() {
    createConnection();
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
            .addChoices([
              ['New ticket', 'new'],
              ['Close ticket', 'close'],
              ['Add ticket participant', 'add'],
              ['Remove ticket participant', 'remove'],
            ]);
        }),
    ];
  }

  public clientOnMessageCreate(message: Message<boolean>): void | Promise<void> {
    // Creates a ticket message object and checks if the message was made inside a ticket channel before proceeding.
    const task = new TicketMessage(message, 'create').init();
  }

  public clientOnMessageUpdate(oldMessage: Message<boolean>, newMessage: Message<boolean>): void | Promise<void> {
    const task = new TicketMessage(newMessage, 'edit').init();
  }

  public clientOnMessageDelete(message: Message<boolean>): void | Promise<void> {
    const task = new TicketMessage(message, 'delete').init();
  }

  public async clientOnInteractionCreate(interaction: Interaction<CacheType>): Promise<void> {
    // Handle component commands
    if (interaction.isButton() && interaction.isMessageComponent()) {
      const channel = (await interaction.channel.fetch()) as TextChannel;
      const message = await interaction.channel.messages.fetch(interaction.message.id);

      // Only try to handle ticket-related actions.
      if (this.isEventInTicketChannel(channel)) {
        if (interaction.customId === 'ticket_close_button') {
          await this.closeTicketChannel(interaction);
        } else if (interaction.customId === 'ticket_dismiss_button') {
          await message.delete();
        } else if (interaction.customId === 'ccc_print_button') {
          interaction.reply(messages.ccc);
        }
      }
    }
    // Handle slash commands
    else if (interaction.isCommand() && interaction.commandName === 'ticket') {
      switch (interaction.options.getString('action')) {
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
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId === 'user_select_add') {
        const [selectedId] = interaction.values;

        await this.addMemberToTicket(interaction, selectedId);
      } else if (interaction.customId === 'user_select_remove') {
        const [selectedId] = interaction.values;

        await this.removeMemberFromTicket(interaction, selectedId);
      }
    }
  }

  private async setup(message: Message) {
    // Ticket configurations are stored by discord guild ID.
    const serverId = parseInt(message.guild.id);

    const config = await new TicketServerConfiguration(serverId).fetch();

    if (config.fromDb) {
      this.processExistingSetup(message, config);
    } else {
      this.processNewSetup(message, config);
    }
  }

  private async processNewSetup(message: Message, config: TicketServerConfiguration) {
    try {
      const promptCategoryEmbed = new MessageEmbed({
        title: 'Where should I make tickets?',
        description: `In order to keep things neat and tidy, all tickets and transcripts will be created under a Discord category.
      
      Please provide a category name. If it doesn't yet exist, I'll take care of setting that up.`,
        color: 0x69f0ae,
        type: 'rich',
      });

      message.channel.send({ embeds: [promptCategoryEmbed] });

      const botFilter = (captured: Message) => captured.content && !captured.author.bot;

      // Wait for user entry. Filter out bot messages.
      const categoryCapture = await message.channel.awaitMessages({
        filter: botFilter,
        max: 1,
        time: 30000,
        errors: ['time'],
      });

      config.category = categoryCapture;

      message.channel.send(`Got it. Category will be \`${config.value.category}\`. Next question...`);

      const promptNotifyRole = new MessageEmbed({
        title: 'Who should I ping when a new ticket is made?',
        description: `Please mention/tag the role that I should @ when a new ticket is created.\n\nThis can be set to \`Admin\`, \`Support Staff\`, \`@everyone\`, or any other role that exists on this server.`,
        color: 0x69f0ae,
        type: 'rich',
      });
      message.channel.send({ embeds: [promptNotifyRole] });

      // Wait for user entry. Filter out bot messages.
      const notifyRoleCapture = await message.channel.awaitMessages({
        filter: botFilter,
        max: 1,
        time: 30000,
        errors: ['time'],
      });

      config.notifyRole = notifyRoleCapture;
      message.channel.send(`Beep Boop! I will notify \`${config.value.notifyRole}\` every time a new ticket is created.`);

      await config.save();

      let categoryChannel = message.guild.channels.cache.find((channel) => {
        return channel.type === 'GUILD_CATEGORY' && channel.name === config.value.category;
      });

      const everyoneRole = message.guild.roles.cache.find((role) => role.name === '@everyone');

      if (!categoryChannel) {
        // Make the ticket channel category with default permissions that will apply to all future
        // created tickets.
        categoryChannel = await message.guild.channels.create(config.value.category, {
          type: 'GUILD_CATEGORY',
          reason: 'Category for all future tickets.',
          permissionOverwrites: [
            {
              id: everyoneRole,
              allow: ['READ_MESSAGE_HISTORY'],
              deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
          ],
        });
      }

      // Check for an existing ticket log channel.
      let ticketLogChannel = message.guild.channels.cache.find(
        (channel) => channel.type === 'GUILD_TEXT' && channel.name === 'ticket-logs'
      );

      if (!ticketLogChannel) {
        ticketLogChannel = await message.guild.channels.create('ticket-logs', {
          type: 'GUILD_TEXT',
          reason: 'Channel to log all closed tickets.',
          parent: categoryChannel.id,
        });
      }

      // Confirmation message
      message.channel
        .send(`All done! I've created a ${config.value.category} channel category and a #ticket-logs channel. For the sake of your puny human memory, I'll be posting there when a ticket is closed.
      `);
    } catch (err: any) {
      // Differentiate between message capture timeouts vs others.
      if (err instanceof Collection) {
        message.channel.send(`Setup timeout. Setup has been cancelled.`);
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
              return (m[this.target] as any).toLowerCase();
            },
          },
          actions: [
            {
              accept: ['yes'],
              action: function (m, v) {
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
      const config = await new TicketServerConfiguration(parseInt(interaction.guild.id)).fetch();

      if (!config.fromDb) {
        interaction.reply('Ticket service not configured. Type `!ticket setup` to setup the service.');

        return;
      }

      // Dry-initialize ticket which collects the server sequence number used as the ticket channel name
      ticket = await new Ticket(interaction).init();

      const parentCategory = interaction.guild.channels.cache.find(
        (channel) => channel.name === config.value.category && channel.type == 'GUILD_CATEGORY'
      ) as CategoryChannel;

      const everyoneRole = interaction.guild.roles.cache.find((role) => role.name === '@everyone');

      // Create channel with ticket record count and leading 0 padding to 4 digits.
      const ticketChannel = await interaction.guild.channels.create(ticket.channelName, {
        type: 'GUILD_TEXT',
        parent: parentCategory,
        permissionOverwrites: [
          this.getTicketReaderPermissionResolvable(interaction.user.id),
          {
            id: everyoneRole,
            deny: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
          },
        ],
      });

      ticket.channelId = ticketChannel.id;

      // From the server configuration, get the role that should be notified about the new ticket
      const notifyRole = interaction.guild.roles.cache.find((role) => role.name == config.value.notifyRole);

      // Send confirmation message and link to created channel.
      interaction.reply({
        content: `:white_check_mark: Your ticket has been created, <#${ticketChannel.id}>.\n\nPlease follow the channel link and provide details there. Tickets without any additional information will be removed.`,
        ephemeral: true,
      });

      const ticketCreateEmbed = new MessageEmbed({
        title: 'Ticket Instructions',
        description: `Thanks <@!${interaction.user.id}>! So that we can better assist, please describe the reason for the ticket:\n\n**Example**:\n\n- Game the issue is on: (Ark, Atlas or Conan)\n- The server or grid your issue is on: (eg. Ark Island, Atlas F9, Conan AoC)\n- A detailed description of your issue: (gimme the deets)\n\nIf this ticket is in regards to on-location assistance in-game, please provide the \`ccc\` coordinates. \n\nAn <@&${notifyRole.id}> will attend to this ticket as soon as one is available.\n\nBelow you'll find a couple of buttons for common tasks, including closing the ticket which can be done at any point in time.`,
      });

      await ticketChannel.send({
        embeds: [ticketCreateEmbed],
        components: [
          new MessageActionRow({
            components: [
              new MessageButton({
                label: 'Close ticket',
                style: 'DANGER',
                customId: 'ticket_close_button',
                emoji: '<a:NeonCheck:647830043304919062>',
              }),
              new MessageButton({
                label: 'Print instructions for getting ccc coordinates',
                style: 'PRIMARY',
                customId: 'ccc_print_button',
                emoji: '<a:cli:748801664714276914>',
              }),
            ],
          }),
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
      allow: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'VIEW_CHANNEL'],
    };
  }

  private async closeTicketPrompt(interaction: CommandInteraction<CacheType>) {
    if (!this.isEventInTicketChannel(interaction.channel as TextChannel)) {
      this.sendOutsideTicketChannelMessage(interaction);
      return;
    }

    await interaction.reply({
      content: `If there's nothing else we can help you with, please close this ticket.`,
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              label: 'Close Ticket',
              customId: 'ticket_close_button',
              style: 'SUCCESS',
              emoji: '<a:NeonCheck:647830043304919062>',
            }),
            new MessageButton({
              label: "Go away, I'm not done yet",
              customId: 'ticket_dismiss_button',
              style: 'SECONDARY',
              emoji: '<a:NO:647830054797312028>',
            }),
          ],
        }),
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

    const memberOptions = interaction.guild.members.cache.map((m) => {
      return {
        label: m.user.username,
        description: `${m.user.username}#${m.user.tag}`,
        value: m.user.id,
      };
    });

    interaction.reply({
      content: 'Select the user to add to this ticket',
      components: [
        new MessageActionRow({
          components: [
            new MessageSelectMenu({
              custom_id: 'user_select_add',
              placeholder: 'Select member from list',
              options: memberOptions,
            }),
          ],
        }),
      ],
      ephemeral: true,
    });
  }

  private async promptUserRemove(interaction: CommandInteraction<CacheType>) {
    if (this.isEventInTicketChannel(interaction.channel as TextChannel) === false) {
      this.sendOutsideTicketChannelMessage(interaction);
    }

    const channelMemberOptions = (interaction.channel as TextChannel).members.map((m) => {
      return {
        label: m.user.username,
        description: `${m.user.username}#${m.user.tag}`,
        value: m.user.id,
      };
    });

    interaction.reply({
      content: 'Select the user to remove from this ticket',
      components: [
        new MessageActionRow({
          components: [
            new MessageSelectMenu({
              custom_id: 'user_select_remove',
              placeholder: 'Select channel member from list',
              options: channelMemberOptions,
            }),
          ],
        }),
      ],
      ephemeral: true,
    });
  }

  private async addMemberToTicket(interaction: SelectMenuInteraction<CacheType>, selectedId: string) {
    try {
      await (interaction.channel as TextChannel).permissionOverwrites.create(selectedId, {
        READ_MESSAGE_HISTORY: true,
        SEND_MESSAGES: true,
        ATTACH_FILES: true,
        VIEW_CHANNEL: true,
      });

      await interaction.update({
        content: 'Successfully added selected member to ticket. They can now see and reply to this channel.',
        components: [],
      });
    } catch (err: any) {
      return interaction.update({
        content: `Failed to add member to channel. ${err.message}`,
      });
    }
  }

  private async removeMemberFromTicket(interaction: SelectMenuInteraction<CacheType>, selectedId: string) {
    try {
      await (interaction.channel as TextChannel).permissionOverwrites.delete(selectedId);

      await interaction.update({
        content: 'Selected user has been removed from this ticket. They can no longer see or send messages on this channel.',
        components: [],
      });
    } catch (err: any) {
      return interaction.update({
        content: `Failed to remove member from channel. ${err.message}`,
      });
    }
  }
}
