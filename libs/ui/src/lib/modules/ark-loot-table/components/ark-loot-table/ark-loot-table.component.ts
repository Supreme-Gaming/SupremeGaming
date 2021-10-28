import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { filter, map, pluck, reduce, switchMap, toArray, withLatestFrom } from 'rxjs/operators';

import {
  KeyedArkItemDictionary,
  ArkSupplyDropTableCrateSetItemEntry,
  SimplifiedArkSupplyDropTableCrate,
  KeyedArkSupplyDropNameDictionary,
} from '@supremegaming/common/interfaces';
import { ArkSupplyDropsService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-ark-loot-table',
  templateUrl: './ark-loot-table.component.html',
  styleUrls: ['./ark-loot-table.component.scss'],
})
export class ArkLootTableComponent implements OnInit {
  public itemDictionary: Observable<KeyedArkItemDictionary>;
  public crates: Observable<Array<MixedArkSupplyDropTableCrate>>;
  public crateNames: Observable<KeyedArkSupplyDropNameDictionary>;
  public mappedCrates: Observable<Array<SimplifiedArkSupplyDropTableCrate>>;

  constructor(private ls: ArkSupplyDropsService) {}

  public ngOnInit(): void {
    this.itemDictionary = this.ls.getArkItemDictionary().pipe(
      switchMap((items) => from(items)),
      reduce((dict, item) => {
        dict[`${item.Class}_C`] = item;

        return dict;
      }, {})
    );

    this.crates = this.ls.getSupplyDropTable().pipe(
      pluck('items'),
      switchMap((crates) => {
        return from(crates);
      }),
      filter((crate) => {
        // Filter out the double supply crates. They have the exact same contents with the exception of
        // different probabilities but that's a problem for later.
        return crate.SupplyCrateClassString.includes('Double') === false;
      }),
      map((crate) => {
        return {
          SupplyCrateClassString: crate.SupplyCrateClassString,
          ItemEntries: crate.ItemSets.reduce((items, set) => {
            return [...items, ...set.ItemEntries];
          }, [] as Array<ArkSupplyDropTableCrateSetItemEntry>),
        };
      }),
      toArray()
    );

    this.crateNames = this.ls.getArkSupplyCrateNames().pipe(
      switchMap((names) => {
        return from(names);
      }),
      reduce((dict, name) => {
        dict[name.classString] = name;

        return dict;
      }, {})
    );

    this.mappedCrates = this.crates.pipe(
      withLatestFrom(this.itemDictionary, this.crateNames),
      switchMap(([crates, dict, names]) => {
        return from(crates).pipe(
          switchMap(
            (crate): Observable<SimplifiedArkSupplyDropTableCrate> => {
              const mappedItems = crate.ItemEntries.map((item) => {
                return {
                  source: item,
                  mapped: dict[item.ItemClassStrings],
                };
              });

              return of({
                SupplyCrateClassString: names[crate.SupplyCrateClassString].name,
                ItemEntries: mappedItems,
              });
            }
          )
        );
      }),
      toArray()
    );
  }
}

/**
 * An intermediary model before the supply drop crate item entries are mapped
 * into item dictionary items
 */
interface MixedArkSupplyDropTableCrate {
  SupplyCrateClassString: string;
  ItemEntries: Array<ArkSupplyDropTableCrateSetItemEntry>;
}
