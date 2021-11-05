import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, from, Observable, pipe } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  toArray,
} from 'rxjs/operators';

import { EnvironmentService } from '@supremegaming/common/ngx';
import {
  ShopRewards,
  Game,
  RewardKitGroup,
  SupremeGamingEnvironmentGameSettings,
  SupremeGamingEnvironment,
  RewardShopItemGroup,
} from '@supremegaming/common/interfaces';
import { RewardsService } from '@supremegaming/data-access';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'supremegaming-rewards-list',
  templateUrl: './rewards-list.component.html',
  styleUrls: ['./rewards-list.component.scss'],
})
export class RewardsListComponent implements OnInit {
  @Input()
  public game: Game;

  public rewards: Observable<ShopRewards>;
  public rewardImageBaseUrl: string;

  public kits: Observable<Array<RewardKitGroup>>;
  public items: Observable<Array<RewardShopItemGroup>>;

  public form: FormGroup;
  public searchTerm: Observable<string>;

  constructor(private env: EnvironmentService, private readonly rs: RewardsService, private readonly fb: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      search: '',
    });
    this.searchTerm = this.form.get('search').valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        if (term.trim() === '') {
          return null;
        }

        return term;
      })
    );

    this.rewardImageBaseUrl = this.env.value<SupremeGamingEnvironment, SupremeGamingEnvironmentGameSettings>('games')[
      this.game
    ]?.rewardsProductImagesUrl;

    this.rewards = this.rs.getRewardsForGame(this.game).pipe(shareReplay());

    this.kits = combineLatest([this.rewards.pipe(pluck('Kits')), this.searchTerm]).pipe(filterGroups());
    this.items = combineLatest([this.rewards.pipe(pluck('ShopItems')), this.searchTerm]).pipe(filterGroups());
  }
}

function filterGroups() {
  return pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    switchMap(([group, term]: [Array<any>, string]) => {
      return from(group).pipe(
        filter((g) => {
          if (term === null) {
            return true;
          }

          return g.WebName.toLowerCase().trim().includes(term.toLowerCase().trim());
        }),
        toArray()
      );
    })
  );
}
