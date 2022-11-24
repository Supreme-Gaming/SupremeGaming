import { CacheType, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';
import {
  CONAN_CONNECTIONS_TEMPLATE,
  CONAN_MODS_TEMPLATE,
  CONAN_PIPPI_TEMPLATE,
  CONAN_STATUS_TEMPLATE,
} from '@supremegaming/discord/templates';

export class ConanInfoDiscordModule implements SlashCommands, OnInteractionCreate {
  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('conan')
        .setDescription('Help info related to Conan Exiles')
        .addStringOption((option) =>
          option
            .setName('info_type')
            .setDescription('Select the type of information for Ark that you need')
            .setRequired(true)
            .addChoice('Connections - Get IP and connection information for joining the servers.', 'connections')
            .addChoice('Online status - Offline or just me? Find out how to check the server status.', 'status')
            .addChoice('Mods - Get info on the mods running on the Supreme Conan servers.', 'mods')
            .addChoice(
              'Pippi - Provides information on Pippi commands and its function on our Conan Exiles servers.',
              'pippi'
            )
        ),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'conan') {
      switch (interaction.options.getString('info_type')) {
        case 'connections':
          interaction.reply({ embeds: [CONAN_CONNECTIONS_TEMPLATE], ephemeral: true });
          break;
        case 'status':
          interaction.reply({ embeds: [CONAN_STATUS_TEMPLATE], ephemeral: true });
          break;
        case 'mods':
          interaction.reply({ embeds: [CONAN_MODS_TEMPLATE], ephemeral: true });
          break;
        case 'pippi':
          interaction.reply({ content: CONAN_PIPPI_TEMPLATE, ephemeral: true });
          break;
        default:
          break;
      }
    }
  }
}
