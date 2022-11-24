import { MessageEmbed } from 'discord.js';

export const CCC_INSTRUCTIONS_TEMPLATE =
  '**CCC Instructions**\n\nPlease follow the following instructions to generate "ccc" coordinates.\n\nCCC coordinates are X,Y,Z world coordinates, different than player map X,Y coordinates, in Unreal Units that can be used by admins to teleport to a specific location on a map/grid. To retrieve these coordinates:\n\n**1.** Ensure that you are at the physical location where you want the admin to teleport to. The generated coordinates will be those of your character\'s current location.\n**2.** Open up your in-game console. By default the "\\`" key, often referred to as a backtick, will invoke the console. This key is most typically found on the top-left of the keyboard near the `esc` key and often shared with the `~` (tilde). The console itself is a thin black bar at the along the bottom of the in-game screen.\n**3.** Type in `ccc`, and press ENTER on your keyboard. On execution, this command will copy your character\'s coordinates to your system clipboard. There will be no feedback on successful execution and it will appear as though nothing has happened. This is normal.\n**4.** Paste (Ctrl + V, or Right click and select "Paste") into this channel.';

export const NEW_MEMBER_PRIVATE_MESSAGE_TEMPLATE =
  "\n\nDO NOT RESPOND, THIS IS A MESSAGE FROM A BOT.\n\nWelcome to the Supreme Gaming!\n\nPlease note that this server carries rules in order to try and provide a balanced and fair atmosphere. Please make sure you read an understand all the rules for the mode you are interested in (PVP or PVE) as ignorance will not be an excuse for breaking them.\n\nWe also offer starter kits if you're into that kind of stuff. Type /kit in global chat to get started. More info can be found @ <https://supremegaming.gg/plugins/points>\n\nIf you have not already, check out <https://supremegaming.gg/?ref=discord> to find all the reference information regarding the server including:\n\n- Quick-join links\n- Server status\n- Real-time player and tribe data\n- Rules\n- Tweaks, mods, and supply drop tables\n- Donation options\n- Forums\n\n Type `!help` in the server discord for commands you can run. If you have any questions don't hesitate to ask in #general or the appropriate channels.";

export const NEW_MEMBER_TEMPLATE =
  'to Supreme Gaming!\n\nWe current offer three hosted game servers:\n\n- ATLAS (PVPVE)\n\n- Ark: Survival Evolved (PVE)\n\n- Conan Exiles (PVE-Conflict)\n\nEach game has role-protected roles to keep you from getting game-related notifications for which you do not have an interest. You will have to add yourself to the proper role in order to see the relevant game channels. To do so, copy-paste any of the following commands here:\n\n`!join pathfinder` - Join the ATLAS role.\n\n`!join arkanite` - Join the Arkanite (Ark) role.\n\n`!join exiled` - Join the Exiled role (Conan Exiles).\n\n`!help` - See all available commands.\n\n';

export const GENERAL_HELP_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Supreme Bot Instructions',
    icon_url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
  },
  color: 0x00ae86,
  // description: 'How to use this bot',
  footer: {
    text: 'If you have any additional issues, please contact and Admin. Thank you.',
    icon_url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
  },
  thumbnail: {
    url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: 'Slash commands',
      value:
        "This bot now supports Discord's fancy slash commands. You can see a list of available bot commands by typing `/` and scrolling on the list that pops up.\n\nThere are a couple of top-level commands including one for each game we host (e.g. `/ark, /atlas, /conan, etc`) that additionally have sub-commands.\n\nNo more need to remember a special prefix or exact command name. Slash commands auto-fill and suggest as you type with available command parameters to make it easier for you.",
    },
  ],
});

export const BAN_HAMMER_ADMIN_TEMPLATE =
  'https://tenor.com/view/thor-banhammer-discord-banned-banned-by-admin-gif-12646581.gif';

export const BAN_HAMMER_USER_TEMPLATE = 'https://imgur.com/BDbrnfE';

export const DONATION_GENERAL_TEMPLATE = new MessageEmbed({
  author: {
    name: 'Donation Information',
    icon_url: 'https://i.dlpng.com/static/png/331426_thumb.png',
  },
  color: 123456,
  description:
    'Thank you so much for your interest on donating! Below is some donation information as well as our donation platforms. \n\nYou can visit [our donation page](https://www.supremegaming.gg/donate) for a one-time donation amount to pick up point packs\n\nYou can visit [our Patreon page](https://www.patreon.com/supremegaming) to subscribe to our Patreon ranks.\n\n',
  footer: {
    text: 'Please contact an admin to adjust your rank in-game. PayPal donations are automatically disbursed but Patreon points must be distributed by an admin manually',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://unixtitan.net/images/money-svg-transparent-background-3.png',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: 'Donor Ranks',
      value: `Donor ranks are based on lifetime contribution amounts\n**Supporter** - $15 or more\n**Donor** - $25 or more\n**Backer** - $50 or more\n**Patron** - $100 or more`,
    },
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'One-Time Donations',
      value: `[Shop Page Link](https://www.supremegaming.gg/donate)\n**300 Points** : $2.50\n**800 Points** : $5.00\n**2,000 Points** : $10.00\n**4,500 Points** : $25.00\n**10,000 Points** : $50.00`,
    },
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Patreon Subscriptions',
      value: `[Patreon Page Link](https://www.patreon.com/supremegaming)\n**Supporter** : $2.50/mo\n**Donor** : $5.00/mo\n**Backer** : $10.00/mo\n**Patron** : $15.00/mo\n**Da Real MVP** : $20.00/mo`,
    },
    {
      name: '\u200B',
      value: '\u200B',
    },
  ],
});
