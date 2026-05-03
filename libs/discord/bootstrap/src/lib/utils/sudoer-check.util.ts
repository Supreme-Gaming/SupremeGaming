import { Guild, PermissionFlagsBits } from 'discord.js';

export function isSudoer(guild: Guild, userId: string, sudoers: string[]): boolean {
  // Guild owner always has sudoer privileges regardless of configuration.
  if (userId === guild.ownerId) return true;

  const member = guild.members.cache.get(userId);

  // Any member with the Administrator permission is always exempt.
  if (member?.permissions.has(PermissionFlagsBits.Administrator)) return true;

  // Direct user ID match in the sudoers list.
  if (sudoers?.includes(userId)) return true;

  // Role-based match: any role the member holds whose ID appears in the sudoers list.
  if (member && member.roles.cache.some((role) => sudoers?.includes(role.id))) return true;

  return false;
}
