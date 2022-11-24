import { CacheType, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';

import {
  ATLAS_CONNECTIONS_TEMPLATE,
  ATLAS_MAP_TEMPLATE,
  ATLAS_MODS_TEMPLATE,
  ATLAS_SHOP_TEMPLATE,
  ATLAS_STATUS_TEMPLATE,
  CCC_INSTRUCTIONS_TEMPLATE,
} from '@supremegaming/discord/templates';

export class AtlasInfoDiscordModule implements SlashCommands, OnInteractionCreate {
  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('atlas')
        .setDescription('Help info related to Atlas')
        .addStringOption((option) =>
          option
            .setName('info_type')
            .setDescription('Select the type of information for Atlas that you need')
            .setRequired(true)
            .addChoice('Connections - Get IP and connection information for joining the servers.', 'connections')
            .addChoice('Online status - Offline or just me? Find out how to check the server status.', 'status')
            .addChoice('Mods - Get info on the mods running on the Supreme Atlas servers.', 'mods')
            .addChoice('Shop - Learn what all you can spend you hard-earned points on.', 'shop')
            .addChoice('Map - Handy map that you can have on your second screen as you navigate the high seas', 'map')
            .addChoice(
              'ccc - Print information on how to get ccc coordinates, required by admins in support requests.',
              'ccc'
            )
        ),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'atlas') {
      switch (interaction.options.getString('info_type')) {
        case 'connections':
          interaction.reply({ embeds: [ATLAS_CONNECTIONS_TEMPLATE], ephemeral: true });
          break;
        case 'status':
          interaction.reply({ embeds: [ATLAS_STATUS_TEMPLATE], ephemeral: true });
          break;
        case 'mods':
          interaction.reply({ embeds: [ATLAS_MODS_TEMPLATE], ephemeral: true });
          break;
        case 'shop':
          interaction.reply({ embeds: [ATLAS_SHOP_TEMPLATE], ephemeral: true });
          break;
        case 'map':
          interaction.reply({ embeds: [ATLAS_MAP_TEMPLATE], ephemeral: true });
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
