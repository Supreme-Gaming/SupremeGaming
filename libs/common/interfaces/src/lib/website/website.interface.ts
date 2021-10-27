export interface SupremeGamingEnvironment {
  production: boolean;
  servers: Array<GameServer>;
  apiUrl: string;
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

  ItemEntries: Array<ArkSupplyDropTableCrateSetItemEntries>;
}

export interface ArkSupplyDropTableCrateSetItemEntries {
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
