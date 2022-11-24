import { MessageEmbed } from 'discord.js';

export const ARK_CONNECTIONS_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Ark Connection Information',
    icon_url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  color: 0x00ae86,
  description: "Get Ark connection IP's as well as one-click clipboard copy and server join links.",
  footer: {
    text: 'Note: Primal Fear does not operate on the same cluster as the primary Ark servers and cannot be transferred to and from.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Ark Main Cluster',
      value: `https://dev.supremegaming.gg/games/ark`,
    },
    {
      name: 'Ark PF Cluster',
      value: `https://dev.supremegaming.gg/games/ark-pf`,
    },
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Adding Servers to Your Favorites List',
      value:
        'For detailed instruction on adding these servers to your steam favorites, please see the following video:\n\nhttps://www.youtube.com/watch?v=uVi-mM7sXQM',
    },
  ],
});

export const ARK_STATUS_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Ark Status Information',
    icon_url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  color: 0x00ae86,
  description: 'Check real-time Ark server status.',
  footer: {
    text: 'Note: Refresh page as needed to get latest status.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Ark Main Cluster',
      value: `https://dev.supremegaming.gg/games/ark`,
    },
    {
      name: 'Ark PF Cluster',
      value: `https://dev.supremegaming.gg/games/ark-pf`,
    },
  ],
});

export const ARK_BREEDING_TEMPLATE =
  'Find all breeding settings including Ark Smart Breeding program settings @ https://dev.supremegaming.gg/games/ark/settings';

export const ARK_MODS_TEMPLATE = new MessageEmbed({
  color: 11414096,
  footer: {
    icon_url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
    text: 'For more information on the mod and its contents, please click the links available.  If the mod list is out-of-date, please contact and admin.',
  },
  thumbnail: {
    url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  fields: [
    {
      name: 'Supreme Ark',
      value: 'The Supreme Ark mod list can be found [in this page](https://dev.supremegaming.gg/games/ark/mods)',
    },
    {
      name: 'Primal Fear',
      value:
        'The Primal Fear mod list can be found [in this collection](https://steamcommunity.com/sharedfiles/filedetails/?id=1692525654)',
    },
  ],
});

export const ARK_SHOP_TEMPLATE = new MessageEmbed({
  color: 11414096,
  thumbnail: {
    url: 'https://cdn.discordapp.com/attachments/450121827335929858/562100404981334016/ark-survival-evolved-logo-2.png',
  },
  fields: [
    {
      name: 'Supreme Ark In-Game Shop',
      value:
        'Forget text walls! Visually browse the in-game shop with icons and quick copy-to-clipboard buttons for easy in-game paste @ https://dev.supremegaming.gg/games/ark/rewards',
    },
  ],
});
