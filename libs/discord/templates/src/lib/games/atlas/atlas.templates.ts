import { Colors, EmbedBuilder } from 'discord.js';

export const ATLAS_HELP_TEMPLATE =
  'The following commands will provide additional information for our Atlas servers:\n\n```**!atlas connections** - Lists the connection information for each grid\n**!atlas status** - Lists the online or offline status for the grids\n**!atlas map** - Provides the in-game map image for reference\n**!atlas mods** - Link the mod collection in steam```';

export const ATLAS_CONNECTIONS_TEMPLATE = new EmbedBuilder({
  author: {
    name: 'Atlas Connection Information',
    icon_url:
      'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  color: 0x00ae86,
  description: 'These are the connection IPs for our Atlas grids',
  footer: {
    text: 'Please Note: Spawn grids are labeled as such and should be the first grid you connect to if playing for the first time.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: 'A',
      value: `\`\`\`css
A1: play.supremegaming.gg:57500 PVP
A2: play.supremegaming.gg:57502 PVP
A3: play.supremegaming.gg:57504 PVP
A4: play.supremegaming.gg:57506
A5: play.supremegaming.gg:57508
A6: play.supremegaming.gg:57510 Spawn
A7: play.supremegaming.gg:57512
A8: play.supremegaming.gg:57514\`\`\``,
    },
    {
      name: 'B',
      value: `\`\`\`css
B1: play.supremegaming.gg:57516 PVP
B2: play.supremegaming.gg:57518 PVP
B3: play.supremegaming.gg:57520 PVP
B4: play.supremegaming.gg:57522
B5: play.supremegaming.gg:57524
B6: play.supremegaming.gg:57526
B7: play.supremegaming.gg:57528
B8: play.supremegaming.gg:57530\`\`\``,
    },
    {
      name: 'C',
      value: `\`\`\`css
C1: play.supremegaming.gg:57532 PVP
C2: play.supremegaming.gg:57534 PVP
C3: play.supremegaming.gg:57536 PVP Spawn
C4: play.supremegaming.gg:57538
C5: play.supremegaming.gg:57540
C6: play.supremegaming.gg:57542
C7: play.supremegaming.gg:57544
C8: play.supremegaming.gg:57546 Spawn\`\`\``,
    },
    {
      name: 'D',
      value: `\`\`\`css
D1: play.supremegaming.gg:57548
D2: play.supremegaming.gg:57550
D3: play.supremegaming.gg:57552
D4: play.supremegaming.gg:57554
D5: play.supremegaming.gg:57556
D6: play.supremegaming.gg:57558
D7: play.supremegaming.gg:57560
D8: play.supremegaming.gg:57562\`\`\``,
    },
    {
      name: 'E',
      value: `\`\`\`css
E1: play.supremegaming.gg:57564
E2: play.supremegaming.gg:57566 Spawn
E3: play.supremegaming.gg:57568
E4: play.supremegaming.gg:57570
E5: play.supremegaming.gg:57572
E6: play.supremegaming.gg:57574
E7: play.supremegaming.gg:57576
E8: play.supremegaming.gg:57578\`\`\``,
    },
    {
      name: 'F',
      value: `\`\`\`css
F1: play.supremegaming.gg:57580
F2: play.supremegaming.gg:57582
F3: play.supremegaming.gg:57584
F4: play.supremegaming.gg:57586
F5: play.supremegaming.gg:57588
F6: play.supremegaming.gg:57590
F7: play.supremegaming.gg:57592
F8: play.supremegaming.gg:57594\`\`\``,
    },
    {
      name: 'G',
      value: `\`\`\`css
G1: play.supremegaming.gg:57596 
G2: play.supremegaming.gg:57598
G3: play.supremegaming.gg:57600
G4: play.supremegaming.gg:57602
G5: play.supremegaming.gg:57604
G6: play.supremegaming.gg:57608
G7: play.supremegaming.gg:57610 Spawn
G8: play.supremegaming.gg:57610\`\`\``,
    },
    {
      name: 'H',
      value: `\`\`\`css
H1: play.supremegaming.gg:57612
H2: play.supremegaming.gg:57614
H3: play.supremegaming.gg:57616
H4: play.supremegaming.gg:57618 Spawn
H5: play.supremegaming.gg:57620
H6: play.supremegaming.gg:57622
H7: play.supremegaming.gg:57624
H8: play.supremegaming.gg:57626\`\`\``,
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

export const ATLAS_STATUS_TEMPLATE = new EmbedBuilder({
  author: {
    name: 'Atlas Server Status Information',
    icon_url:
      'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  color: 0x00ae86,
  description: 'Check real-time Atlas server status.',
  footer: {
    text: 'Note: Refresh page as needed to get latest status.',
    icon_url: 'https://cdn.discordapp.com/attachments/538786025162407937/561016376119132172/cogsolo.PNG',
  },
  thumbnail: {
    url: 'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  timestamp: Date.now(),
  fields: [
    {
      name: '\u200B',
      value: '\u200B',
    },
    {
      name: 'Supreme Atlas',
      value: `https://dev.supremegaming.gg/games/atlas`,
    },
  ],
});

export const ATLAS_MAP_TEMPLATE = new EmbedBuilder()
  .setColor(Colors.NotQuiteBlack)
  .setTitle('Supreme Atlas Map')
  .setDescription('')
  .addFields({
    name: 'Latest map with online status',
    value: 'https://dev.supremegaming.gg/games/atlas',
  });

export const ATLAS_MODS_TEMPLATE = new EmbedBuilder({
  color: 11414096,
  footer: {
    icon_url: 'https://cdn.discordapp.com/attachments/565297051341029386/580389255872774144/SG_Cog.png',
    text: 'For more information on the mod and its contents, please click the links available.  If the mod list is out-of-date, please contact and admin.',
  },
  thumbnail: {
    url: 'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  fields: [
    {
      name: 'Supreme Atlas Mods',
      value: 'The Supreme Atlas mod list can be found [in this page](https://dev.supremegaming.gg/games/atlas/mods)',
    },
  ],
});

export const ATLAS_SHOP_TEMPLATE = new EmbedBuilder({
  color: 11414096,
  thumbnail: {
    url: 'https://c-3sux78kvnkay76x24mgskvkjogx2eiax78ykijtx2eius.g00.gamepedia.com/g00/3_c-3gx78q.mgskvkjog.ius_/c-3SUXKVNKAY76x24nzzvyx3ax2fx2fmgskvkjog.iax78ykijt.iusx2fgx78qyax78bobgrkburbkj_mgskvkjogx2fix2fijx2fGZRGY_rumu.vtmx3fbkx78youtx3d6j0577j23igh5gk1kg109l62i8gg8874_$/$/$/$/$?i10c.ua=1&i10c.dv=11',
  },
  fields: [
    {
      name: 'Supreme Atlas In-Game Shop',
      value:
        'Forget text walls! Visually browse the in-game shop with icons and quick copy-to-clipboard buttons for easy in-game paste @ https://dev.supremegaming.gg/games/atlas/rewards',
    },
  ],
});
