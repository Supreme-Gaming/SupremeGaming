export interface SupremeGamingEnvironment {
  production: boolean;
  servers: Array<GameServer>;
  apiUrl: string;
  games?: SupremeGamingEnvironmentGameSettings;
}

export interface SupremeGamingEnvironmentGameSettings {
  atlas?: {
    /**
     * Root URL for static assets. Some assets on this website don't make sense to store in version control, so they are hosted separately.
     */
    gridImages?: string;

    /**
     * URL endpoint that returns shop rewards for Ark
     */
    rewardsUrl?: string;

    /**
     * Base URL where the product images for ark rewards are hosted.
     */
    rewardsProductImagesUrl?: string;
  };

  ark?: {
    /**
     * URL endpoint that returns shop rewards for Ark
     */
    rewardsUrl?: string;

    /**
     * Base URL where the product images for ark rewards are hosted.
     */
    rewardsProductImagesUrl?: string;
  };
}

export interface GameServer {
  host: string;
  port: number;
  rcon_port: number;
  map_name: string;
  game: Game;
}

export interface BaseAPIResponse {
  success: boolean;
  status: number;
  message: string;
}

export interface GameServerStatus extends BaseAPIResponse {
  data: {
    name: string;
    map: string;
    maxplayers: number;
    installversion: string;
    status: {
      online: boolean;
      accessible: boolean;
    };
  };
}

export interface GameServerPlayersResponse extends BaseAPIResponse {
  data: Array<GameServerPlayer>;
}
export interface GameServerPlayersResponse extends BaseAPIResponse {
  data: Array<GameServerPlayer>;
}

export interface GameServerTribesResponse extends BaseAPIResponse {
  data: Array<GameServerTribe>;
}

export interface GameServerPlayer {
  Admin: number;
  AvatarUrl: string;
  Banned: number;
  CharacterName: string;
  CommunityBanned: number;
  DataPort: string;
  DaysSinceLastBan: number;
  Engrams: number;
  FileCreated: number;
  FileUpdated: number;
  Guid: string;
  Host: string;
  Id: number;
  Level: number;
  NumberOfGameBans: number;
  NumberOfVACBans: number;
  PlayMap: string;
  ProfileUrl: string;
  SteamId: string;
  SteamName: string;
  TribeGuid: string;
  TribeId: number;
  TribeName: string;
  VACBanned: number;

  // Used for Atlas
  LastOnline: number;
}

export interface GameServerTribe {
  DataPort: string;
  FileCreated: number;
  FileUpdated: number;
  Guid: string;
  Host: string;
  Id: number;
  Members: Array<GameServerPlayer>;
  Name: string;
  OwnerId: number;
  PlayMap: string;
  TribeLog: string;

  /// Used for Atlas
  TribeName: string;
}

export interface ArkSupplyDropTable {
  items: Array<ArkSupplyDropTableCrate>;
}

export interface ArkSupplyDropTableCrate {
  /**
   * Supply crate ID
   */
  SupplyCrateClassString: string;

  /**
   * Number in string representation
   */
  MinItemSets: string;

  /**
   * Number in string representation
   */
  MaxItemSets: string;

  /**
   * Double in string representation
   */
  NumItemSetsPower: string;

  /**
   * Boolean in string representation
   */
  bSetsRandomWithoutReplacement: string;

  ItemSets: Array<ArkSupplyDropTableCrateSet>;
}

export interface ArkSupplyDropTableCrateSet {
  /**
   * Number in string representation
   */
  MinNumItems: string;

  /**
   * Number in string representation
   */
  MaxNumItems: string;

  /**
   * Double in string representation
   */
  NumItemsPower: string;

  /**
   * Double in string representation
   */
  SetWeight: string;

  /**
   * Boolean in string representation
   */
  bItemsRandomWithoutReplacement: string;

  ItemEntries: Array<ArkSupplyDropTableCrateSetItemEntry>;
}

export interface ArkSupplyDropTableCrateSetItemEntry {
  /**
   * Double in string representation
   */
  EntryWeight: string;

  ItemClassStrings: string;

  /**
   * Double in string representation
   */
  MinQuantity: string;

  /**
   * Double in string representation
   */
  MaxQuantity: string;

  /**
   * Double in string representation
   */
  MinQuality: string;

  /**
   * Double in string representation
   */
  MaxQuality: string;

  /**
   * Boolean in string representation
   */
  bForceBlueprint: string;

  /**
   * Double in string representation
   */
  ChanceToBeBlueprintOverride: string;
}

export interface SimplifiedArkSupplyDropTableCrate {
  SupplyCrateClassString: string;
  ItemEntries: Array<{
    source: ArkSupplyDropTableCrateSetItemEntry;
    mapped: ArkItemDictionaryItem;
  }>;
}

export type ArkItemDictionary = Array<ArkItemDictionaryItem>;

export interface ArkItemDictionaryItem {
  /**
   * Friendly readable item name
   */
  ItemName: string;

  /**
   * Item category (e.g. ammunition, saddle, food, etc)
   */
  Type: string;

  /**
   * Class name without the _C suffix
   */
  Class: string;
}

/**
 * Ark item dictionary in object form, keyed by item class name, for efficient item lookup
 * instead of iterating to find the matching item.
 */
export interface KeyedArkItemDictionary {
  [key: string]: ArkItemDictionaryItem;
}

export interface ArkSupplyDropName {
  /**
   * Supply drop class string
   */
  classString: string;

  /**
   * Friendly readable supply drop name
   */
  name: string;
}

export type ArkSupplyDropNameDictionary = Array<ArkSupplyDropName>;

export interface KeyedArkSupplyDropNameDictionary {
  [key: string]: ArkSupplyDropName;
}

/**
 * Shop reward config as exported from source.
 */
export interface SourceShopRewards {
  Kits: { [key: string]: RewardKitGroup };
  ShopItems: { [key: string]: RewardShopItemGroup };
}

/**
 * Transformed reward config so it's more friendly to use in templates.
 */
export interface ShopRewards {
  Kits: Array<RewardKitGroup>;
  ShopItems: Array<RewardShopItemGroup>;
}

export interface BaseRewardSet {
  /**
   * This is the key of the kit or item entry.
   */
  SpawnCode: string;

  /**
   * Number of points the item is buy.
   */
  Price: number;
  Description: string;
  WebCategory: string;
  WebName: string;
  WebDefaultAmount: number;
  WebImgUrl: string;
  Items: Array<RewardItem>;
}

export interface RewardKitGroup extends BaseRewardSet {
  DefaultAmount: number;
}

export interface RewardShopItemGroup extends BaseRewardSet {
  Type: string;
}

export interface RewardItem {
  Amount: number;
  Quality: number;
  Blueprint: string;
  WebKitItemName: string;
}

export type Game = keyof SupremeGamingEnvironment['games'];
