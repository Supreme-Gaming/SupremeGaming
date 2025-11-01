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
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
  PermissionFlagsBits,
  Guild,
  EmbedBuilder,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { createConnection, ConnectionOptionsReader } from 'typeorm';

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

import {
  CCC_INSTRUCTIONS_TEMPLATE,
  EOSID_INSTRUCTIONS_TEMPLATE,
  STEAMID_INSTRUCTIONS_TEMPLATE,
} from '@supremegaming/discord/templates';
import { TicketEntity } from './entities/ticket.entity';
import { TicketAttachment } from './entities/ticket-attachment.entity';
import { TicketConfiguration } from './entities/ticket-configuration.entity';
import { TicketMessageEntity } from './entities/ticket-message.entity';

export class TicketClient implements SlashCommands, OnMessageCreate, OnMessageUpdate, OnMessageDelete, OnInteractionCreate {
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
      new SlashCommandBuilder()
        .setName('ticket-config')
        .setDescription('Configure the ticket system (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
    // Handle configuration buttons (not channel-specific)
    if (interaction.isButton() && interaction.isMessageComponent()) {
      if (interaction.customId === 'config_edit_text') {
        await this.handleConfigEditText(interaction);
        return;
      } else if (interaction.customId === 'config_complete') {
        await this.handleConfigComplete(interaction);
        return;
      }

      // Handle ticket-related buttons
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
        } else if (interaction.customId === 'steamid_print_button') {
          interaction.reply(STEAMID_INSTRUCTIONS_TEMPLATE);
        } else if (interaction.customId === 'eosid_print_button') {
          interaction.reply(EOSID_INSTRUCTIONS_TEMPLATE);
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
    } else if (interaction.isCommand() && interaction.commandName === 'ticket-config') {
      await this.showConfigModal(interaction);
    } else if (interaction.isModalSubmit() && interaction.customId === 'ticket_config_text_modal') {
      await this.handleConfigTextModalSubmit(interaction);
    } else if (interaction.isRoleSelectMenu()) {
      if (interaction.customId === 'config_notify_role_select') {
        await this.handleNotifyRoleSelect(interaction);
      } else if (interaction.customId === 'config_permissions_select') {
        await this.handlePermissionsSelect(interaction);
      }
    } else if (interaction.isChannelSelectMenu()) {
      if (interaction.customId === 'config_category_select') {
        await this.handleCategorySelect(interaction);
      } else if (interaction.customId === 'config_log_channel_select') {
        await this.handleLogChannelSelect(interaction);
      }
    } else if (interaction.isMentionableSelectMenu()) {
      if (interaction.customId === 'config_sudoers_select') {
        await this.handleSudoersSelect(interaction);
      } else if (interaction.customId === 'config_notifiers_select') {
        await this.handleNotifiersSelect(interaction);
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
    }
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
        interaction.reply({
          content: 'Ticket service not configured. Use `/ticket-config` to setup the service.',
          ephemeral: true,
        });

        return;
      }

      // Dry-initialize ticket which collects the server sequence number used as the ticket channel name
      ticket = await new Ticket(interaction).init();

      const parentCategory = interaction.guild.channels.cache.find(
        (channel) => channel.name === config.value.category && channel.type == ChannelType.GuildCategory
      ) as CategoryChannel;

      const everyoneRole = interaction.guild.roles.cache.find((role) => role.name === '@everyone');

      // Build permission overwrites array
      const permissionOverwrites: OverwriteResolvable[] = [
        this.getTicketReaderPermissionResolvable(interaction.user.id),
        {
          id: everyoneRole,
          deny: ['SendMessages', 'ReadMessageHistory', 'ViewChannel'],
        },
      ];

      // Add configured permission overrides for roles/users that should have access to all tickets
      if (config.value.permissionOverrides && config.value.permissionOverrides.length > 0) {
        for (const overrideId of config.value.permissionOverrides) {
          permissionOverwrites.push(this.getTicketReaderPermissionResolvable(overrideId));
        }
      }

      // Create channel with ticket record count and leading 0 padding to 4 digits.
      const ticketChannel = (await interaction.guild.channels.create({
        name: ticket.channelName,
        type: ChannelType.GuildText,
        parent: parentCategory,
        permissionOverwrites,
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

      const steamid = new ButtonBuilder()
        .setLabel('Print instructions for getting Steam ID')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('steamid_print_button')
        .setEmoji('<a:cli:748801664714276914>');

      const eosid = new ButtonBuilder()
        .setLabel('Print instructions for getting EOS ID')
        .setStyle(ButtonStyle.Success)
        .setCustomId('eosid_print_button')
        .setEmoji('<a:cli:748801664714276914>');

      await ticketChannel.send({
        embeds: [ticketCreateEmbed],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [close, print, steamid, eosid],
          },
        ],
      });

      // Send custom template message with notifiers if configured
      if (config.value.templateMessage || (config.value.notifiers && config.value.notifiers.length > 0)) {
        let notificationContent = '';

        // Add notifiers mentions
        if (config.value.notifiers && config.value.notifiers.length > 0) {
          const mentions = config.value.notifiers.map((id) => this.formatMention(id, interaction.guild)).join(' ');
          notificationContent = mentions;
        }

        // Add template message if configured
        if (config.value.templateMessage) {
          if (notificationContent) {
            notificationContent += '\n\n';
          }
          notificationContent += config.value.templateMessage;
        }

        if (notificationContent) {
          await ticketChannel.send(notificationContent);
        }
      }

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
      allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'AddReactions', 'UseExternalEmojis'],
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

    // Get configured log channel
    const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
    let logChannel: TextChannel;

    if (config.value.logChannelId) {
      logChannel = interaction.guild.channels.cache.get(config.value.logChannelId) as TextChannel;
    }

    // Fallback to ticket-logs channel if not configured or not found
    if (!logChannel) {
      logChannel = interaction.guild.channels.cache.find((c) => {
        return c.name === 'ticket-logs';
      }) as TextChannel;
    }

    const ticketName = (interaction.channel as TextChannel).name.split('-')[1];

    await interaction.channel.delete();
    await existingTicket.close();

    // Send close confirmation to logs channel.
    if (logChannel) {
      return logChannel.send(`Ticket ${ticketName} was closed by ${interaction.user.username}`);
    }
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

  private async removeMemberFromTicket(interaction: UserSelectMenuInteraction<CacheType>, selectedId: string, name: string) {
    try {
      await (interaction.channel as TextChannel).permissionOverwrites.delete(selectedId);

      await interaction.update({
        content: `${name} has been removed from this ticket. They can no longer see or send messages on this channel.`,
        components: [],
      });
    } catch (err) {
      return interaction.update({
        content: `Failed to remove ${name} from channel. ${err.message}`,
      });
    }
  }

  private async checkSudoerPermission(interaction: CommandInteraction<CacheType>): Promise<boolean> {
    const config = await new TicketServerConfiguration(interaction.guild.id).fetch();

    // Always allow guild owner
    if (interaction.user.id === interaction.guild.ownerId) {
      return true;
    }

    // If no sudoers configured, allow all admins
    if (!config.fromDb || !config.value.sudoers || config.value.sudoers.length === 0) {
      return true;
    }

    // Check if user is in sudoers list
    if (config.value.sudoers.includes(interaction.user.id)) {
      return true;
    }

    // Check if user has any of the sudoer roles
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member && member.roles.cache.some((role) => config.value.sudoers.includes(role.id))) {
      return true;
    }

    return false;
  }

  private async showConfigModal(interaction: CommandInteraction<CacheType>) {
    // Check sudoer permissions
    const hasPermission = await this.checkSudoerPermission(interaction);
    if (!hasPermission) {
      return interaction.reply({
        content:
          '❌ You do not have permission to configure the ticket system. Only authorized administrators can access this.',
        ephemeral: true,
      });
    }

    // Load existing configuration
    const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
    const configValue = config.value;

    console.log('[Ticket Config] Loaded config:', configValue);

    // Get current role and channel names for display
    const currentRole = configValue.notifyRole
      ? interaction.guild.roles.cache.find((r) => r.name === configValue.notifyRole || r.id === configValue.notifyRole)
      : null;

    const currentLogChannel = configValue.logChannelId
      ? interaction.guild.channels.cache.get(configValue.logChannelId)
      : null;

    const currentSudoers =
      configValue.sudoers && configValue.sudoers.length > 0
        ? configValue.sudoers
            .map((id) => {
              const user = interaction.guild.members.cache.get(id);
              const role = interaction.guild.roles.cache.get(id);
              return user ? `<@${id}>` : role ? `<@&${id}>` : id;
            })
            .join(', ')
        : 'None configured';

    const currentPermissionOverrides =
      configValue.permissionOverrides && configValue.permissionOverrides.length > 0
        ? configValue.permissionOverrides
            .map((id) => {
              const role = interaction.guild.roles.cache.get(id);
              return role ? `<@&${id}>` : id;
            })
            .join(', ')
        : 'None configured';

    // Create embed showing current configuration
    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket System Configuration')
      .setDescription('Configure your ticket system using the select menus below. Current settings are shown.')
      .setColor(0x69f0ae)
      .addFields(
        { name: 'Category', value: configValue.category || 'tickets', inline: true },
        {
          name: 'Notify Role',
          value: currentRole ? `<@&${currentRole.id}>` : configValue.notifyRole || 'Not set',
          inline: true,
        },
        { name: 'Log Channel', value: currentLogChannel ? `<#${currentLogChannel.id}>` : 'Not set', inline: true },
        { name: 'Sudoers (Admins)', value: currentSudoers, inline: false },
        {
          name: 'Permission Overrides (Roles with ticket access)',
          value: currentPermissionOverrides,
          inline: false,
        },
        { name: 'Template Message', value: configValue.templateMessage || 'None', inline: false }
      )
      .setFooter({ text: 'Select options below to update configuration' });

    // Create modal for text fields (category and template)
    const textModal = new ModalBuilder().setCustomId('ticket_config_text_modal').setTitle('Text Configuration');

    const categoryInput = new TextInputBuilder()
      .setCustomId('category_input')
      .setLabel('Category Name')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('tickets')
      .setValue(configValue.category || 'tickets')
      .setRequired(true);

    const templateInput = new TextInputBuilder()
      .setCustomId('template_input')
      .setLabel('Template Follow-up Message')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter the message to send when a ticket is created...')
      .setValue(configValue.templateMessage || '')
      .setRequired(false);

    textModal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(categoryInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(templateInput)
    );

    // Send configuration interface with select menus
    // Note: Discord limits messages to 5 action rows maximum
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('config_edit_text')
            .setLabel('Edit Category & Template')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📝'),
          new ButtonBuilder()
            .setCustomId('config_complete')
            .setLabel('Save & Complete')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
        ),
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          new RoleSelectMenuBuilder()
            .setCustomId('config_notify_role_select')
            .setPlaceholder('Select role to notify on new tickets')
            .setMaxValues(1)
        ),
        new ActionRowBuilder<MentionableSelectMenuBuilder>().addComponents(
          new MentionableSelectMenuBuilder()
            .setCustomId('config_sudoers_select')
            .setPlaceholder('Select sudoers (admins who can configure)')
            .setMinValues(0)
            .setMaxValues(25)
        ),
        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
          new RoleSelectMenuBuilder()
            .setCustomId('config_permissions_select')
            .setPlaceholder('Select roles with ticket access (read, send, attach, react)')
            .setMinValues(0)
            .setMaxValues(25)
        ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId('config_log_channel_select')
            .setPlaceholder('Select log channel for ticket transcripts')
            .setChannelTypes([ChannelType.GuildText])
            .setMaxValues(1)
        ),
      ],
    });
  }

  private async handleConfigEditText(interaction: ButtonInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const configValue = config.value;

      // Show modal for text inputs
      const textModal = new ModalBuilder().setCustomId('ticket_config_text_modal').setTitle('Text Configuration');

      const categoryInput = new TextInputBuilder()
        .setCustomId('category_input')
        .setLabel('Category Name')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('tickets')
        .setValue(configValue.category || 'tickets')
        .setRequired(true);

      const templateInput = new TextInputBuilder()
        .setCustomId('template_input')
        .setLabel('Template Follow-up Message')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter the message to send when a ticket is created...')
        .setValue(configValue.templateMessage || '')
        .setRequired(false);

      textModal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(categoryInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(templateInput)
      );

      await interaction.showModal(textModal);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to show configuration modal.',
        ephemeral: true,
      });
    }
  }

  private async handleConfigTextModalSubmit(interaction: ModalSubmitInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();

      const category = interaction.fields.getTextInputValue('category_input');
      const template = interaction.fields.getTextInputValue('template_input');

      config.updateFromModalData({
        category,
        templateMessage: template,
      });

      await config.save();

      // Ensure category exists
      await this.ensureCategoryExists(interaction.guild, category);

      await interaction.reply({
        content: `✅ Configuration updated!\n**Category:** ${category}\n**Template:** ${template ? 'Set' : 'None'}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to save configuration. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handleNotifyRoleSelect(interaction: RoleSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const [roleId] = interaction.values;
      const role = interaction.guild.roles.cache.get(roleId);

      if (role) {
        config.updateFromModalData({ notifyRole: role.name });
        await config.save();

        await interaction.update({
          content: `✅ Notify role set to: <@&${roleId}>`,
          components: interaction.message.components,
        });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update notify role. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handleConfigComplete(interaction: ButtonInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const configValue = config.value;

      const permissionOverridesList =
        configValue.permissionOverrides && configValue.permissionOverrides.length > 0
          ? configValue.permissionOverrides
              .map((id) => {
                const role = interaction.guild.roles.cache.get(id);
                return role ? `<@&${id}>` : id;
              })
              .join(', ')
          : 'None';

      const embed = new EmbedBuilder()
        .setTitle('✅ Configuration Saved')
        .setDescription('Your ticket system configuration has been saved successfully!')
        .setColor(0x00ff00)
        .addFields(
          { name: 'Category', value: configValue.category || 'tickets', inline: true },
          { name: 'Notify Role', value: configValue.notifyRole || 'Not set', inline: true },
          {
            name: 'Log Channel',
            value: configValue.logChannelId ? `<#${configValue.logChannelId}>` : 'Not set',
            inline: true,
          },
          {
            name: 'Sudoers',
            value: configValue.sudoers?.length > 0 ? `${configValue.sudoers.length} configured` : 'None',
            inline: false,
          },
          {
            name: 'Permission Overrides',
            value: permissionOverridesList,
            inline: false,
          }
        );

      await interaction.update({
        embeds: [embed],
        components: [],
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to complete configuration.',
        ephemeral: true,
      });
    }
  }

  private async handleCategorySelect(interaction: ChannelSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const [channelId] = interaction.values;
      const channel = interaction.guild.channels.cache.get(channelId);

      if (channel && channel.type === ChannelType.GuildCategory) {
        config.updateFromModalData({ category: channel.name });
        await config.save();

        await interaction.update({
          content: `✅ Ticket category set to: **${channel.name}**`,
          components: [],
        });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update category. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handleLogChannelSelect(interaction: ChannelSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const [channelId] = interaction.values;

      config.updateFromModalData({ logChannelId: channelId });
      await config.save();

      // Ensure log channel exists
      await this.ensureLogChannelExists(interaction.guild, config.value.category, channelId);

      await interaction.update({
        content: `✅ Log channel set to: <#${channelId}>`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update log channel. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handleSudoersSelect(interaction: MentionableSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const sudoers = interaction.values;

      // Add guild owner if not already included
      const ownerId = interaction.guild.ownerId;
      if (!sudoers.includes(ownerId)) {
        sudoers.push(ownerId);
      }

      config.updateFromModalData({ sudoers });
      await config.save();

      const mentions = sudoers.map((id) => this.formatMention(id, interaction.guild)).join(', ');

      await interaction.update({
        content: `✅ Sudoers updated: ${mentions}`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update sudoers. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handleNotifiersSelect(interaction: MentionableSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const notifiers = interaction.values;

      config.updateFromModalData({ notifiers });
      await config.save();

      const mentions = notifiers.map((id) => this.formatMention(id, interaction.guild)).join(', ');

      await interaction.update({
        content: `✅ Notifiers updated: ${mentions}`,
        components: [],
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update notifiers. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async handlePermissionsSelect(interaction: RoleSelectMenuInteraction<CacheType>) {
    try {
      const config = await new TicketServerConfiguration(interaction.guild.id).fetch();
      const permissionOverrides = interaction.values; // These are role IDs

      config.updateFromModalData({ permissionOverrides });
      await config.save();

      // Format role mentions for display
      const roleMentions = permissionOverrides
        .map((roleId) => {
          const role = interaction.guild.roles.cache.get(roleId);
          return role ? `<@&${roleId}>` : roleId;
        })
        .join(', ');

      const permissionsList = [
        '✅ View Channel',
        '✅ Send Messages',
        '✅ Attach Files',
        '✅ Add Reactions',
        '✅ Use External Emojis',
      ].join('\n');

      await interaction.update({
        content: `✅ Permission overrides updated!\n\n**Roles:** ${
          roleMentions || 'None'
        }\n\n**These roles will have the following permissions in ticket channels:**\n${permissionsList}`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to update permission overrides. Please try again.',
        ephemeral: true,
      });
    }
  }

  private async ensureCategoryExists(guild: Guild, categoryName: string) {
    let categoryChannel = guild.channels.cache.find((channel) => {
      return channel.type === ChannelType.GuildCategory && channel.name === categoryName;
    });

    const everyoneRole = guild.roles.cache.find((role) => role.name === '@everyone');

    if (!categoryChannel) {
      categoryChannel = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
        reason: 'Category for all future tickets.',
        permissionOverwrites: [
          {
            id: everyoneRole,
            allow: ['ReadMessageHistory'],
            deny: ['SendMessages', 'ViewChannel'],
          },
        ],
      });
    }

    return categoryChannel;
  }

  private async ensureLogChannelExists(guild: Guild, categoryName: string, logChannelId?: string) {
    // If a specific log channel was configured, use it
    if (logChannelId && guild.channels.cache.has(logChannelId)) {
      return guild.channels.cache.get(logChannelId);
    }

    // Otherwise, create or find ticket-logs
    let ticketLogChannel = guild.channels.cache.find(
      (channel) => channel.type === ChannelType.GuildText && channel.name === 'ticket-logs'
    );

    if (!ticketLogChannel) {
      const categoryChannel = guild.channels.cache.find((channel) => {
        return channel.type === ChannelType.GuildCategory && channel.name === categoryName;
      });

      ticketLogChannel = await guild.channels.create({
        name: 'ticket-logs',
        type: ChannelType.GuildText,
        reason: 'Channel to log all closed tickets.',
        parent: categoryChannel?.id,
      });
    }

    return ticketLogChannel;
  }

  /**
   * Helper method to format a mention correctly based on whether the ID is a role or user
   */
  private formatMention(id: string, guild: Guild): string {
    const role = guild.roles.cache.get(id);
    return role ? `<@&${id}>` : `<@${id}>`;
  }
}
