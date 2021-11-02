import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';

import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { PlayersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-player-search-list',
  templateUrl: './player-search-list.component.html',
  styleUrls: ['./player-search-list.component.scss'],
})
export class PlayerSearchListComponent implements OnInit {
  /**
   * Game to restrict player search to. This value is included to the http
   * request so the receiving API must support it.
   */
  @Input()
  public game: string;

  @Input()
  public placeholder: string;

  public form: FormGroup;

  public players: Observable<Array<GameServerPlayer>>;

  public searchTerm: Observable<string>;

  constructor(private readonly fb: FormBuilder, private readonly ps: PlayersService) {}

  public ngOnInit() {
    this.form = this.fb.group({
      search: '',
    });

    this.searchTerm = this.form.get('search').valueChanges.pipe(debounceTime(500));

    this.players = this.searchTerm.pipe(
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim() === '') {
          return of(null);
        }

        return this.ps.searchPlayersForGame(this.game, term);
      }),
      shareReplay()
    );
  }
}
