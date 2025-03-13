import { CacheType, CommandInteractionOptionResolver, Interaction, PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { PatreonCreatorClient, PatreonStore } from 'patreon-api.ts';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';

export class PatreonReportDiscordModule implements SlashCommands, OnInteractionCreate {
  public patreonClient = new PatreonCreatorClient({
    name: 'Supreme Gaming V2',
    oauth: {
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      token: {
        access_token: process.env.PATREON_ACCESS_TOKEN,
        refresh_token: process.env.PATREON_REFRESH_TOKEN,
      },
    },
  }).initialize();

  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('patreon')
        .setDescription('Patreon community integration - Admins only')
        .addSubcommandGroup((group) =>
          group
            .setName('list')
            .setDescription('List patrons based on criteria')
            .addSubcommand((subcommand) =>
              subcommand
                .setName('active')
                .setDescription('List active patrons')
                .addBooleanOption((option) =>
                  option.setName('ephemeral').setDescription('Send the message as ephemeral').setRequired(false)
                )
            )
        )
        .addSubcommandGroup((group) =>
          group
            .setName('audit')
            .setDescription('Audit Patron by ID')
            .addSubcommand((subcommand) =>
              subcommand
                .setName('patron')
                .setDescription('Get information about a patron by their ID')
                .addStringOption((subcommand) =>
                  subcommand
                    .setName('patron_id')
                    .setDescription('Get information about a patron by their ID')
                    .setRequired(true)
                )
                .addBooleanOption((option) =>
                  option.setName('ephemeral').setDescription('Send the message as ephemeral').setRequired(false)
                )
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    ];
  }

  public async clientOnInteractionCreate(interaction: Interaction<CacheType>): Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'patreon') {
      const subCommandGroup = (interaction.options as CommandInteractionOptionResolver).getSubcommandGroup();
      const subCommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand();
      const ephemeral = (interaction.options as CommandInteractionOptionResolver).getBoolean('ephemeral') || true;

      await interaction.deferReply({ ephemeral });

      if (subCommandGroup === 'list') {
        await interaction.editReply({
          content: 'List of active patrons',
        });
      } else if (subCommandGroup === 'audit') {
        await interaction.editReply({
          content: 'Audit patron by ID feature is not yet implemented.',
        });
      }
    }
  }
}
