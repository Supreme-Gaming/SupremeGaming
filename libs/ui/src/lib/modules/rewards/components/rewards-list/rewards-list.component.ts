import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { EnvironmentService } from '@supremegaming/common/ngx';
import {
  ShopRewards,
  Game,
  RewardKitGroup,
  SupremeGamingEnvironmentGameSettings,
  SupremeGamingEnvironment,
} from '@supremegaming/common/interfaces';
import { RewardsService } from '@supremegaming/data-access';

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
  public items: Observable<Array<RewardKitGroup>>;

  constructor(private env: EnvironmentService, private readonly rs: RewardsService) {}

  public ngOnInit(): void {
    this.rewardImageBaseUrl = this.env.value<SupremeGamingEnvironment, SupremeGamingEnvironmentGameSettings>('games')[
      this.game
    ]?.rewardsProductImagesUrl;

    this.rewards = this.rs.getRewardsForGame(this.game).pipe(shareReplay());
  }
}
