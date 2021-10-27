import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ArkItemDictionary, ArkSupplyDropTable } from '@supremegaming/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ArkSupplyDropsService {
  constructor(private readonly http: HttpClient) {}

  public getSupplyDropTable() {
    return this.http.get<ArkSupplyDropTable>('./assets/data/lootTable.json');
  }

  public getArkItemDictionary() {
    return this.http.get<ArkItemDictionary>('./assets/data/arkItemDictionary.json');
  }
}
