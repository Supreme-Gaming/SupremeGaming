import { MessageReaction, PartialMessageReaction, User, PartialUser, GuildMember, TextChannel } from 'discord.js';

import { OnMessageReactionAdd, OnMessageReactionRemove } from '@supremegaming/discord/bootstrap';

export class RoleAssignmentDiscordModule implements OnMessageReactionAdd, OnMessageReactionRemove {
  public allowedRoleChannel = process.env.DISCORD_ROLE_CHANNEL_NAME;

  public async clientOnMessageReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    if ((<TextChannel>reaction.message.channel).name == this.allowedRoleChannel) {
      try {
        const resolved = await this.resolveReaction(reaction, user);

        if (resolved.reaction.emoji.name === 'ark') {
          await this.handleReactionRole(resolved.reaction, 'ark', 'Arkanite', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'conan') {
          await this.handleReactionRole(resolved.reaction, 'conan', 'Exiled', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'atlas') {
          await this.handleReactionRole(resolved.reaction, 'atlas', 'Pathfinder', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'LastOasis') {
          await this.handleReactionRole(resolved.reaction, 'LastOasis', 'Nomad', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'minecraft') {
          await this.handleReactionRole(resolved.reaction, 'minecraft', 'Minecrafter', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'valheim') {
          await this.handleReactionRole(resolved.reaction, 'valheim', 'Viking', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === '7d2d') {
          await this.handleReactionRole(resolved.reaction, '7d2d', '7D2D', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'rust') {
          await this.handleReactionRole(resolved.reaction, 'rust', 'Rust', resolved.member, 'add');
        } else if (resolved.reaction.emoji.name === 'space_engineers') {
          await this.handleReactionRole(resolved.reaction, 'space_engineers', 'Astronaut', resolved.member, 'add');
        }
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  }

  public async clientOnMessageReactionRemove(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    if ((<TextChannel>reaction.message.channel).name == this.allowedRoleChannel) {
      try {
        const resolved = await this.resolveReaction(reaction, user);

        if (resolved.reaction.emoji.name === 'ark') {
          await this.handleReactionRole(resolved.reaction, 'ark', 'Arkanite', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'conan') {
          await this.handleReactionRole(resolved.reaction, 'conan', 'Exiled', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'atlas') {
          await this.handleReactionRole(resolved.reaction, 'atlas', 'Pathfinder', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'LastOasis') {
          await this.handleReactionRole(resolved.reaction, 'LastOasis', 'Nomad', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'minecraft') {
          await this.handleReactionRole(resolved.reaction, 'minecraft', 'Minecrafter', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'valheim') {
          await this.handleReactionRole(resolved.reaction, 'valheim', 'Viking', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === '7d2d') {
          await this.handleReactionRole(resolved.reaction, '7d2d', '7D2D', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'rust') {
          await this.handleReactionRole(resolved.reaction, 'rust', 'Rust', resolved.member, 'remove');
        } else if (resolved.reaction.emoji.name === 'space_engineers') {
          await this.handleReactionRole(resolved.reaction, 'space_engineers', 'Astronaut', resolved.member, 'remove');
        }
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  }

  private async handleReactionRole(
    reaction: MessageReaction,
    matchingEmojiName: string,
    matchingRoleName: string,
    member: GuildMember,
    action: 'add' | 'remove'
  ) {
    if (reaction.emoji.name == matchingEmojiName) {
      const role = reaction.message.guild.roles.cache.find((role) => role.name == matchingRoleName);

      try {
        const hasRole = member.roles.cache.has(role.id);

        if (action === 'add' && hasRole === false) {
          const status = await member.roles.add(role.id);

          console.log(`Added ${matchingRoleName} role from ${member.user.username}`);
        } else if (action === 'remove' && hasRole === true) {
          const status = await member.roles.remove(role.id);

          console.log(`Removed ${matchingRoleName} role from ${member.user.username}`);
        }
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  }

  private async resolveReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    let member: GuildMember;

    if (user.id !== undefined) {
      if (user.partial) {
        await user.fetch();
      }

      member = await reaction.message.guild.members.fetch(user.id);
    } else {
      console.warn('Reaction does not contain a valid user. Will not attempt to edit role.');

      return;
    }

    let resolvedReaction;

    if (reaction.partial) {
      resolvedReaction = await reaction.fetch();
    } else {
      resolvedReaction = reaction as MessageReaction;
    }

    return {
      reaction: resolvedReaction,
      member,
    };
  }
}
