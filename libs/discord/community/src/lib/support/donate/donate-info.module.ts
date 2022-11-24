import { CacheType, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';
import { DONATION_GENERAL_TEMPLATE } from '@supremegaming/discord/templates';

export class DonateDiscordModule implements SlashCommands, OnInteractionCreate {
  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Interested in helping keep the lights on? Learn about donation methods and perks.'),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'donate') {
      interaction.reply({ embeds: [DONATION_GENERAL_TEMPLATE] });
    }
  }
}
