import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ChannelType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  Interaction,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createConnection, ConnectionOptionsReader } from 'typeorm';

import {
  OnInteractionCreate,
  OnMessageCreate,
  OnReady,
  SlashCommands,
  SlashCommandTypes,
  isSudoer,
} from '@supremegaming/discord/bootstrap';

import { HoneypotServerConfiguration } from './features/honeypot-server-configuration.feature';
import { HoneypotConfiguration } from './entities/honeypot-configuration.entity';

export class HoneypotDiscordModule implements SlashCommands, OnReady, OnMessageCreate, OnInteractionCreate {
  constructor() {
    this.connect();
  }

  public connect(): void {
    const reader = new ConnectionOptionsReader();
    reader
      .get('default')
      .then((opts) => {
        createConnection({ ...opts, entities: [HoneypotConfiguration] });
      })
      .catch((err) => {
        console.error('[Honeypot] Failed to establish DB connection:', err);
      });
  }

  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('honeypot-config')
        .setDescription('Configure the honeypot ban system (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ];
  }

  public async clientOnReady(client: Client): Promise<void> {
    for (const [, guild] of client.guilds.cache) {
      await this.ensureWarningMessage(guild);
    }

    setInterval(async () => {
      for (const [, guild] of client.guilds.cache) {
        await this.ensureWarningMessage(guild);
      }
    }, 60 * 60 * 1000);
  }

  public async clientOnMessageCreate(message: Message<boolean>): Promise<void> {
    if (message.author.bot) return;
    if (!message.guild) return;

    try {
      const config = await new HoneypotServerConfiguration(message.guild.id).fetch();

      if (!config.fromDb || !config.value.honeypotChannelId) return;
      if (message.channel.id !== config.value.honeypotChannelId) return;
      if (isSudoer(message.guild, message.author.id, config.value.sudoers)) return;

      await message.guild.members.ban(message.author.id, {
        deleteMessageSeconds: 60,
        reason: 'Honeypot: posted in honeypot channel',
      });

      console.log(`[Honeypot] Banned ${message.author.tag} (${message.author.id}) in guild ${message.guild.name}`);

      await this.postBanReport(message, config.value.reportingChannelId);
    } catch (err) {
      console.error('[Honeypot] Error processing honeypot message:', err);
    }
  }

  public async clientOnInteractionCreate(interaction: Interaction<CacheType>): Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'honeypot-config') {
      await this.showHoneypotConfig(interaction as CommandInteraction<CacheType>);
      return;
    }

    if (interaction.isChannelSelectMenu()) {
      if (interaction.customId === 'honeypot_channel_select') {
        await this.handleHoneypotChannelSelect(interaction as ChannelSelectMenuInteraction<CacheType>);
      } else if (interaction.customId === 'honeypot_reporting_channel_select') {
        await this.handleReportingChannelSelect(interaction as ChannelSelectMenuInteraction<CacheType>);
      }
      return;
    }

    if (interaction.isMentionableSelectMenu()) {
      if (interaction.customId === 'honeypot_sudoers_select') {
        await this.handleSudoersSelect(interaction as MentionableSelectMenuInteraction<CacheType>);
      }
      return;
    }

    if (interaction.isButton() && interaction.isMessageComponent()) {
      if (interaction.customId.startsWith('honeypot_confirm_ban_')) {
        const userId = interaction.customId.slice('honeypot_confirm_ban_'.length);
        await this.handleConfirmBan(interaction as ButtonInteraction<CacheType>, userId);
      } else if (interaction.customId.startsWith('honeypot_revert_ban_')) {
        const userId = interaction.customId.slice('honeypot_revert_ban_'.length);
        await this.handleRevertBan(interaction as ButtonInteraction<CacheType>, userId);
      }
    }
  }

  private async ensureWarningMessage(guild: Guild): Promise<void> {
    try {
      const config = await new HoneypotServerConfiguration(guild.id).fetch();

      if (!config.fromDb || !config.value.honeypotChannelId) return;

      const channel = guild.channels.cache.get(config.value.honeypotChannelId) as TextChannel;
      if (!channel) return;

      if (config.value.warningMessageId) {
        try {
          await channel.messages.fetch(config.value.warningMessageId);
          return;
        } catch (err) {
          console.warn(`[Honeypot] Warning message not found in guild ${guild.id}, will re-post:`, err);
        }
      }

      const posted = await channel.send({ embeds: [this.buildWarningEmbed()] });
      await posted.pin();

      config.updateFromData({ warningMessageId: posted.id });
      await config.save();

      console.log(`[Honeypot] Posted warning message in guild ${guild.name}`);
    } catch (err) {
      console.error(`[Honeypot] Error ensuring warning message for guild ${guild.id}:`, err);
    }
  }

  private buildWarningEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('🍯 Honeypot Channel — Do Not Post')
      .setDescription(
        'This channel is a bot **honeypot**. It is intentionally visible to all members.\n\n' +
          '**Sending any message here will result in an immediate, permanent ban — no warnings, no exceptions.**\n\n' +
          'There is no legitimate reason to post in this channel. If you are a human and are seeing this message, leave immediately.'
      )
      .setColor(0xff0000)
      .setFooter({
        text: 'Posting here = permanent ban. Appeal via ticket from another account.',
      });
  }

  private async postBanReport(message: Message<boolean>, reportingChannelId: string): Promise<void> {
    if (!reportingChannelId) return;

    const reportingChannel = message.guild.channels.cache.get(reportingChannelId) as TextChannel;
    if (!reportingChannel) return;

    const accountAgeDays = Math.floor((Date.now() - message.author.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    const reportEmbed = new EmbedBuilder()
      .setTitle('Honeypot Ban Report')
      .setColor(0xff4500)
      .addFields(
        { name: 'User', value: `${message.author.tag} (<@${message.author.id}>)`, inline: true },
        { name: 'User ID', value: message.author.id, inline: true },
        { name: 'Account Age', value: `${accountAgeDays} day${accountAgeDays !== 1 ? 's' : ''}`, inline: true },
        {
          name: 'Message Content',
          value: message.content?.slice(0, 1024) || '_[no text content]_',
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({ text: 'User has been banned. Use buttons below to confirm or revert.' });

    const confirmButton = new ButtonBuilder()
      .setCustomId(`honeypot_confirm_ban_${message.author.id}`)
      .setLabel('Confirm Ban')
      .setStyle(ButtonStyle.Success);

    const revertButton = new ButtonBuilder()
      .setCustomId(`honeypot_revert_ban_${message.author.id}`)
      .setLabel('Lift Ban')
      .setStyle(ButtonStyle.Danger);

    await reportingChannel.send({
      embeds: [reportEmbed],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, revertButton)],
    });
  }

  private async showHoneypotConfig(interaction: CommandInteraction<CacheType>): Promise<void> {
    const config = await new HoneypotServerConfiguration(interaction.guild.id).fetch();

    if (!isSudoer(interaction.guild, interaction.user.id, config.value.sudoers)) {
      await interaction.reply({
        content: '❌ You do not have permission to configure the honeypot system.',
        ephemeral: true,
      });
      return;
    }

    const cv = config.value;

    const honeypotChannelDisplay = cv.honeypotChannelId ? `<#${cv.honeypotChannelId}>` : 'Not configured';
    const reportingChannelDisplay = cv.reportingChannelId ? `<#${cv.reportingChannelId}>` : 'Not configured';
    const sudoersDisplay =
      cv.sudoers.length > 0
        ? cv.sudoers
            .map((id) => {
              const role = interaction.guild.roles.cache.get(id);
              return role ? `<@&${id}>` : `<@${id}>`;
            })
            .join(', ')
        : 'None (all admins allowed)';

    const embed = new EmbedBuilder()
      .setTitle('Honeypot Configuration')
      .setDescription('Configure the honeypot ban system using the select menus below.')
      .setColor(0xff4500)
      .addFields(
        { name: 'Honeypot Channel', value: honeypotChannelDisplay, inline: true },
        { name: 'Reporting Channel', value: reportingChannelDisplay, inline: true },
        { name: 'Sudoers (exempt from bans)', value: sudoersDisplay, inline: false }
      )
      .setFooter({ text: 'Sudoers and server owners are never banned by the honeypot.' });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId('honeypot_channel_select')
            .setPlaceholder('Select honeypot channel')
            .setChannelTypes([ChannelType.GuildText])
            .setMaxValues(1)
        ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId('honeypot_reporting_channel_select')
            .setPlaceholder('Select reporting/mod channel')
            .setChannelTypes([ChannelType.GuildText])
            .setMaxValues(1)
        ),
        new ActionRowBuilder<MentionableSelectMenuBuilder>().addComponents(
          new MentionableSelectMenuBuilder()
            .setCustomId('honeypot_sudoers_select')
            .setPlaceholder('Select sudoers (users/roles exempt from ban)')
            .setMinValues(0)
            .setMaxValues(25)
        ),
      ],
    });
  }

  private async handleHoneypotChannelSelect(interaction: ChannelSelectMenuInteraction<CacheType>): Promise<void> {
    try {
      const [channelId] = interaction.values;
      const config = await new HoneypotServerConfiguration(interaction.guild.id).fetch();

      const channelChanged = config.value.honeypotChannelId !== channelId;

      config.updateFromData({
        honeypotChannelId: channelId,
        ...(channelChanged ? { warningMessageId: undefined } : {}),
      });
      await config.save();

      if (channelChanged) {
        await this.ensureWarningMessage(interaction.guild);
      }

      await interaction.update({
        content: `✅ Honeypot channel set to <#${channelId}>. Warning message posted/pinned.`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error('[Honeypot] handleHoneypotChannelSelect error:', err);
      await interaction.reply({ content: '❌ Failed to update honeypot channel.', ephemeral: true });
    }
  }

  private async handleReportingChannelSelect(interaction: ChannelSelectMenuInteraction<CacheType>): Promise<void> {
    try {
      const [channelId] = interaction.values;
      const config = await new HoneypotServerConfiguration(interaction.guild.id).fetch();

      config.updateFromData({ reportingChannelId: channelId });
      await config.save();

      await interaction.update({
        content: `✅ Reporting channel set to <#${channelId}>.`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error('[Honeypot] handleReportingChannelSelect error:', err);
      await interaction.reply({ content: '❌ Failed to update reporting channel.', ephemeral: true });
    }
  }

  private async handleSudoersSelect(interaction: MentionableSelectMenuInteraction<CacheType>): Promise<void> {
    try {
      const config = await new HoneypotServerConfiguration(interaction.guild.id).fetch();
      config.updateFromData({ sudoers: interaction.values });
      await config.save();

      const mentions =
        interaction.values
          .map((id) => {
            const role = interaction.guild.roles.cache.get(id);
            return role ? `<@&${id}>` : `<@${id}>`;
          })
          .join(', ') || 'None';

      await interaction.update({
        content: `✅ Sudoers updated: ${mentions}`,
        components: interaction.message.components,
      });
    } catch (err) {
      console.error('[Honeypot] handleSudoersSelect error:', err);
      await interaction.reply({ content: '❌ Failed to update sudoers.', ephemeral: true });
    }
  }

  private async handleConfirmBan(interaction: ButtonInteraction<CacheType>, userId: string): Promise<void> {
    try {
      const ban = await interaction.guild.bans.fetch(userId).catch(() => null);

      const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor(0x00c853)
        .setFooter({
          text: ban
            ? `Ban confirmed by ${interaction.user.tag}`
            : `Note: User is no longer banned. Confirmed by ${interaction.user.tag}`,
        });

      await interaction.update({ embeds: [updatedEmbed], components: [] });
    } catch (err) {
      console.error('[Honeypot] handleConfirmBan error:', err);
      await interaction.reply({ content: '❌ Failed to confirm ban.', ephemeral: true });
    }
  }

  private async handleRevertBan(interaction: ButtonInteraction<CacheType>, userId: string): Promise<void> {
    try {
      await interaction.guild.members.unban(userId, `Honeypot ban reverted by ${interaction.user.tag}`);

      const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor(0xffab00)
        .setFooter({ text: `Ban reverted by ${interaction.user.tag}` });

      await interaction.update({ embeds: [updatedEmbed], components: [] });
    } catch (err) {
      console.error('[Honeypot] handleRevertBan error:', err);
      await interaction.reply({
        content: '❌ Failed to revert ban. User may already be unbanned or not found.',
        ephemeral: true,
      });
    }
  }
}
