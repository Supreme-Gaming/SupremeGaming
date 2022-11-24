import { CacheType, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { OnInteractionCreate, SlashCommands, SlashCommandTypes } from '@supremegaming/discord/bootstrap';

export class FunDiscordModule implements SlashCommands, OnInteractionCreate {
  public commands(): SlashCommandTypes {
    return [
      new SlashCommandBuilder()
        .setName('random')
        .setDescription('These commands are....random.')
        .addStringOption((option) => {
          return option
            .setName('cmd_choice')
            .setDescription('This needs a description. Go figure.')
            .setRequired(true)
            .addChoices([
              ["It's too late", 'apologize'],
              ['Never gonna', 'giveYouUp'],
              ['If you like it', 'putARingOnIt'],
              ['Am I a real boy?', 'creator'],
              ['LF: Passive pen', 'passivePen'],
            ]);
        }),
    ];
  }

  public clientOnInteractionCreate(interaction: Interaction<CacheType>): void | Promise<void> {
    if (interaction.isCommand() && interaction.commandName === 'random') {
      switch (interaction.options.getString('cmd_choice')) {
        case 'apologize':
          interaction.reply('TO APOLOGIZE');
          break;
        case 'giveYouUp':
          interaction.reply('GIVE YOU UP');
          break;
        case 'putARingOnIt':
          interaction.reply(`THEN YOU SHOULD'A PUT A RING ON IT`);
          break;
        case 'creator':
          interaction.reply('<@145702927099494400>, he brought me into this world.');
          break;
        case 'passivePen':
          interaction.reply('Trading one passive pen for 5k hard poly and 5k cp');
          break;
        default:
          break;
      }
    }
  }
}
