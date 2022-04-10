import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';

import { GameServerPlayer, GameServerTribe } from '@supremegaming/common/interfaces';
import { TribesService } from '@supremegaming/data-access';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  selector: 'supremegaming-tribe-details',
  templateUrl: './tribe-details.component.html',
  styleUrls: ['../player-details/player-details.component.scss', './tribe-details.component.scss'],
})
export class TribeDetailsComponent extends AbstractResourceTableComponent<GameServerTribe> implements OnInit {
  @Input()
  public tribeGuid: Observable<string>;

  @Input()
  public game: string;

  public tribe: Observable<GameServerTribe>;
  public tribeOwner: Observable<GameServerPlayer>;
  public tribeMembers: Observable<Array<GameServerPlayer>>;

  constructor(private readonly ts: TribesService) {
    super();
  }

  public ngOnInit(): void {
    this.tribe = this.tribeGuid.pipe(
      switchMap((guid) => {
        return this.ts.searchTribesForGame(this.game, guid).pipe(
          map((results) => {
            const [tribe] = results;
            return tribe;
          })
        );
      }),
      shareReplay()
    );

    this.tribeMembers = this.tribe.pipe(pluck('Members'));

    this.tribeOwner = this.tribeMembers.pipe(
      withLatestFrom(this.tribe.pipe(pluck('OwnerId'))),
      map(([members, ownerId]) => {
        return members.find((m) => {
          return m.Id === ownerId;
        });
      })
    );
  }
}

