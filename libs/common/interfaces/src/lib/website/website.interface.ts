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
  };
}

export interface GameServer {
  host: string;
  port: number;
  rcon_port: number;
  map_name: string;
  game: 'ark' | 'conan' | 'atlas';
}

export interface GameServerStatus {
  success: boolean;
  status: number;
  message: string;
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

export interface GameServerOnlinePlayers {
  success: boolean;
  status: number;
  message: string;
  data: Array<GameServerPlayer>;
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
