import { MessageEmbed } from 'discord.js';

export const CONAN_CONNECTIONS_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Conan Connection Information',
    icon_url:
      'https://i2.wp.com/trg.network/wp-content/uploads/group-avatars/12/59c317315fdd6-bpfull.png?resize=200%2C200&ssl=1',
  },
  color: 0x00ae86,
  description: "Get Conan connection IP's as well as one-click clipboard copy and server join links.",
  footer: {
    text: 'If you need further assistance please contact and admin. Thank you.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://i2.wp.com/trg.network/wp-content/uploads/group-avatars/12/59c317315fdd6-bpfull.png?resize=200%2C200&ssl=1',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: 'Conan Siptah and Calamitous',
      value: `https://dev.supremegaming.gg/games/conan`,
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

export const CONAN_STATUS_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Conan Server Status Information',
    icon_url:
      'https://i2.wp.com/trg.network/wp-content/uploads/group-avatars/12/59c317315fdd6-bpfull.png?resize=200%2C200&ssl=1',
  },
  color: 0x00ae86,
  description: 'Check real-time Conan server status.',
  footer: {
    text: 'Note: Refresh page as needed to get latest status.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://i2.wp.com/trg.network/wp-content/uploads/group-avatars/12/59c317315fdd6-bpfull.png?resize=200%2C200&ssl=1',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Conan Siptah and Calamitous',
      value: `https://dev.supremegaming.gg/games/conan`,
    },
  ],
});

export const CONAN_MODS_TEMPLATE = new MessageEmbed({
  color: 11414096,
  footer: {
    icon_url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
    text: 'For more information on the mod and its contents, please click the links available.  If the mod list is out-of-date, please contact and admin.',
  },
  thumbnail: {
    url: 'https://i2.wp.com/trg.network/wp-content/uploads/group-avatars/12/59c317315fdd6-bpfull.png?resize=200%2C200&ssl=1',
  },
  fields: [
    {
      name: 'Supreme Calamitous',
      value: 'The Supreme Calamitous mod list can be found [in this page](https://dev.supremegaming.gg/games/conan/mods)',
    },
  ],
});

export const CONAN_PIPPI_TEMPLATE = '```fix\n\nComing Soon```';
