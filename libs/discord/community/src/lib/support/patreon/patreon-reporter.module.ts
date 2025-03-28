import { CacheType, CommandInteractionOptionResolver, EmbedBuilder, Interaction, PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { PatreonCreatorClient, QueryBuilder, Tier } from 'patreon-api.ts';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';

export class PatreonReportDiscordModule implements SlashCommands, OnInteractionCreate {
  public patreonClient = new PatreonCreatorClient({
    oauth: {
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      token: {
        access_token: process.env.PATREON_ACCESS_TOKEN,
        refresh_token: process.env.PATREON_REFRESH_TOKEN,
      },
    },
  });

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

      const shouldBePersistent =
        interaction.options.get('ephemeral')?.value !== undefined &&
        (interaction.options as CommandInteractionOptionResolver).getBoolean('ephemeral') === false;

      await interaction.deferReply({ ephemeral: !shouldBePersistent });

      if (subCommandGroup === 'list') {
        let definedTiers = process.env.PATREON_TIERS_DISCORD_ROLES;

        if (!definedTiers) {
          await interaction.editReply({
            content: 'No defined tiers found. Please define application discord tiers and roles.',
          });

          return;
        } else {
          try {
            definedTiers = JSON.parse(definedTiers);
          } catch (err) {
            await interaction.editReply({
              content: 'An error occurred while parsing the defined tiers. Please check the configuration.',
            });

            return;
          }
        }

        const memberQuery = QueryBuilder.campaignMembers
          .addRelationships(['currently_entitled_tiers', 'user'])
          .setAttributes({
            member: [
              'full_name',
              'last_charge_date',
              'last_charge_status',
              'campaign_lifetime_support_cents',
              'currently_entitled_amount_cents',
              'patron_status',
            ],
            tier: ['amount_cents', 'description', 'discord_role_ids', 'title'],
            user: ['created', 'social_connections'],
          })
          .setRequestOptions({
            count: 1000,
          });

        try {
          const members = await this.patreonClient.fetchCampaignMembers(process.env.PATREON_CAMPAIGN_ID, memberQuery);

          const mappedTiers: Record<
            string,
            Pick<Tier, 'description' | 'amount_cents' | 'discord_role_ids' | 'title'>
          > = members.included
            .filter((tier) => tier.type === 'tier')
            .reduce((acc, curr) => {
              acc[curr.id] = curr.attributes;
              return acc;
            }, {});

          const mappedUserSocialConnections = members.included
            .filter((user) => user.type === 'user')
            .reduce((acc, curr) => {
              acc[curr.id] = curr.attributes['social_connections'];
              return acc;
            }, {});

          const activeMembers = members.data
            .filter((member) => member.attributes.patron_status === 'active_patron')
            .map((member) => {
              const tier = mappedTiers[member.relationships.currently_entitled_tiers.data[0].id];

              // Find the mapped tier with the highest
              const earnedTier = Object.values(mappedTiers).reduce((acc, currentMax) => {
                if (acc === null) {
                  return currentMax;
                }

                if (
                  currentMax.amount_cents >= acc.amount_cents &&
                  member.attributes.campaign_lifetime_support_cents >= currentMax.amount_cents
                ) {
                  return currentMax;
                }

                return acc;
              }, null);

              const userSocialConnections = mappedUserSocialConnections[member.relationships.user.data.id];

              return {
                user: member.attributes.full_name,
                tier: tier.title,
                earnedTier: earnedTier ? earnedTier?.title : null,
                amount: tier.amount_cents / 100,
                lifetimeSupport: member.attributes.campaign_lifetime_support_cents / 100,
                lastChargeDate: member.attributes.last_charge_date,
                lastChargeStatus: member.attributes.last_charge_status,
                discordId: userSocialConnections.discord ? userSocialConnections.discord.user_id : null,
              };
            });

          // Group active members into buckets of 24
          const activeMembersChunks = activeMembers.reduce((acc, curr, index) => {
            const chunkIndex = Math.floor(index / 24);
            if (!acc[chunkIndex]) {
              acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(curr);
            return acc;
          }, []);

          // One embed per chunk
          const embeds = activeMembersChunks.map((chunk, index) => {
            const embed = new EmbedBuilder({
              title: 'Active Patrons',
              description: `Total Active Patrons: ${activeMembers.length}`,
              color: 0x00ae86,
              footer: {
                text: `Page ${index + 1} of ${activeMembersChunks.length}`,
              },
              fields: chunk.map((member) => ({
                name: member.user,
                value: `Sub: ${member.tier}\nEarned: ${member.earnedTier}\nAmount: $${member.amount.toFixed(
                  2
                )}\nLifetime: $${member.lifetimeSupport.toFixed(2)}\nLCD: <t:${
                  Date.parse(member.lastChargeDate) / 1000
                }:f>\nDiscord ID: ${member.discordId !== null ? `<@${member.discordId}>` : 'N/A'}`,
              })),
            });

            return embed;
          });

          await interaction.editReply({
            embeds,
          });
        } catch (err) {
          console.error(err);

          await interaction.editReply({
            content: 'An error occurred while fetching the list of active patrons.',
          });
        }
      } else if (subCommandGroup === 'audit') {
        await interaction.editReply({
          content: 'Audit patron by ID feature is not yet implemented.',
        });
      }
    }
  }
}
