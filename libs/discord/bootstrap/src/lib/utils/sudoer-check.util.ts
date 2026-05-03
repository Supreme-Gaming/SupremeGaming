import { Guild, PermissionFlagsBits } from 'discord.js';

export function isSudoer(guild: Guild, userId: string, sudoers: string[]): boolean {
  // Guild owner always has sudoer privileges regardless of configuration.
  if (userId === guild.ownerId) return true;

  // If no sudoers are configured, fall back to Discord's native Administrator permission.
  if (!sudoers || sudoers.length === 0) {
    const member = guild.members.cache.get(userId);
    return member?.permissions.has(PermissionFlagsBits.Administrator) ?? false;
  }

  // Direct user ID match in the sudoers list.
  if (sudoers.includes(userId)) return true;

  // Role-based match: any role the member holds whose ID appears in the sudoers list.
  const member = guild.members.cache.get(userId);
  if (member && member.roles.cache.some((role) => sudoers.includes(role.id))) return true;

  return false;
}
