import { GuildMember, TextChannel } from 'discord.js';

import { OnGuildMemberAdd } from '@supremegaming/discord/bootstrap';

export class NewMemberDiscordModule implements OnGuildMemberAdd {
  public clientOnGuildMemberAdd(member: GuildMember): void {
    const defaultChannel = member.guild.channels.cache.find(
      (c) => c.name == process.env.DISCORD_WELCOME_CHANNEL_NAME
    ) as TextChannel;

    // const roleChannel = member.guild.channels.cache.find((c) => c.name === process.env.DISCORD_ROLE_CHANNEL_NAME);

    defaultChannel.send(
      `Welcome to Supreme Gaming ${member}!\n\nTo unlock more channels, you'll need to assign yourself some Discord roles for the games you're here for. Head over to the Roles & Channels onboarding page to get started.`
    );
  }
}
