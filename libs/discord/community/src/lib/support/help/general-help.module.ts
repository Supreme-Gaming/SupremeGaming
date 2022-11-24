import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Interaction } from 'discord.js';

import { OnInteractionCreate, SlashCommands } from '@supremegaming/discord/bootstrap';
import { GENERAL_HELP_TEMPLATE } from '@supremegaming/discord/templates';

export class GeneralHelpDiscordModule implements OnInteractionCreate, SlashCommands {
  public commands() {
    return [
      new SlashCommandBuilder()
        .setName('help')
        .setDescription('See general information on how to use Supreme Bot to request and perform additional actions.'),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void {
    if (interaction.isCommand()) {
      if (interaction.commandName === 'help') {
        interaction.reply({ embeds: [GENERAL_HELP_TEMPLATE], ephemeral: true });
      }
    }
  }
}
