import { CacheType, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';
import {
  ARK_BREEDING_TEMPLATE,
  ARK_CONNECTIONS_TEMPLATE,
  ARK_MODS_TEMPLATE,
  ARK_SHOP_TEMPLATE,
  ARK_STATUS_TEMPLATE,
  CCC_INSTRUCTIONS_TEMPLATE,
} from '@supremegaming/discord/templates';

export class ArkInfoDiscordModule implements SlashCommands, OnInteractionCreate {
  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('ark')
        .setDescription('Help info related to Ark: Survival Evolved')
        .addStringOption((option) =>
          option
            .setName('info_type')
            .setDescription('Select the type of information for Ark that you need')
            .setRequired(true)
            .addChoices(
              { name: 'Connections - Get IP and connection information for joining the servers.', value: 'connections' },
              { name: 'Online status - Offline or just me? Find out how to check the server status.', value: 'status' },
              { name: 'Mods - Get info on the mods running on the Supreme Ark servers.', value: 'mods' },
              { name: 'Shop - Learn what all you can spend you hard-earned points on.', value: 'shop' },
              {
                name: 'Breeding - General information on the breeding program and settings that this server uses.',
                value: 'breeding',
              },
              {
                name: 'ccc - Print information on how to get ccc coordinates, required by admins in support requests.',
                value: 'ccc',
              }
            )
        ),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void> {
    if (interaction.isCommand()) {
      if (interaction.commandName === 'ark') {
        switch (interaction.options.getString('info_type')) {
          case 'connections':
            interaction.reply({ embeds: [ARK_CONNECTIONS_TEMPLATE], ephemeral: true });
            break;
          case 'status':
            interaction.reply({ embeds: [ARK_STATUS_TEMPLATE], ephemeral: true });
            break;
          case 'mods':
            interaction.reply({ embeds: [ARK_MODS_TEMPLATE], ephemeral: true });
            break;
          case 'shop':
            interaction.reply({ embeds: [ARK_SHOP_TEMPLATE], ephemeral: true });
            break;
          case 'breeding':
            interaction.reply({ content: ARK_BREEDING_TEMPLATE, ephemeral: true });
            break;
          case 'ccc':
            interaction.reply({ content: CCC_INSTRUCTIONS_TEMPLATE });
            break;
          default:
            break;
        }
      }
    }
  }
}
