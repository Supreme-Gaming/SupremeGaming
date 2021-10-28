import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, from, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  reduce,
  shareReplay,
  startWith,
  switchMap,
  toArray,
} from 'rxjs/operators';

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

  public form: FormGroup;

  private searchText: Observable<string>;

  constructor(private ls: ArkSupplyDropsService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    // The form control is used to access the form control API to easily detect
    // text input changes
    this.form = this.fb.group({
      search: '',
    });

    // Search control observable that will emit 500ms after typing stop and only if the source
    // input is not the same as the previous value.
    this.searchText = this.form.get('search').valueChanges.pipe(startWith(''), debounceTime(500), distinctUntilChanged());

    this.itemDictionary = this.ls.getArkItemDictionary().pipe(
      switchMap((items) => from(items)),
      reduce((dict, item) => {
        // Dictionary items don't have the _C suffix that the drop table item entries do
        // Need to add the suffix to be able to lookup easily.
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

    this.mappedCrates = combineLatest([this.crates, this.searchText, this.itemDictionary, this.crateNames]).pipe(
      switchMap(([crates, matchText, dict, names]) => {
        return from(crates).pipe(
          switchMap(
            (crate): Observable<SimplifiedArkSupplyDropTableCrate> => {
              const mappedItems = crate.ItemEntries.reduce((items, item) => {
                const mappedItem = {
                  source: item,
                  mapped: dict[item.ItemClassStrings],
                };

                // If the search term is an empty string, no filtering should take place.
                if (matchText === '') {
                  items.push(mappedItem);
                } else {
                  const friendlyName = dict[item.ItemClassStrings].ItemName.toLowerCase();
                  const searchTermIsInName = friendlyName.includes(matchText);

                  if (searchTermIsInName) {
                    items.push(mappedItem);
                  }
                }

                return items;
              }, []);

              return of({
                SupplyCrateClassString: names[crate.SupplyCrateClassString].name,
                ItemEntries: mappedItems,
              });
            }
          ),
          filter((crate) => {
            return crate.ItemEntries.length > 0;
          }),
          toArray()
        );
      }),
      shareReplay()
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
