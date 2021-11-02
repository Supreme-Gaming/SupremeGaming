import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';

import { GameServerTribe } from '@supremegaming/common/interfaces';
import { TribesService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-tribe-search-list',
  templateUrl: './tribe-search-list.component.html',
  styleUrls: ['./tribe-search-list.component.scss'],
})
export class TribeSearchListComponent implements OnInit {
  /**
   * Game to restrict player search to. This value is included to the http
   * request so the receiving API must support it.
   */
  @Input()
  public game: string;

  @Input()
  public placeholder: string;

  public form: FormGroup;

  public tribes: Observable<Array<GameServerTribe>>;

  public searchTerm: Observable<string>;

  constructor(private readonly fb: FormBuilder, private readonly ts: TribesService) {}

  public ngOnInit() {
    this.form = this.fb.group({
      search: '',
    });

    this.searchTerm = this.form.get('search').valueChanges.pipe(debounceTime(500));

    this.tribes = this.searchTerm.pipe(
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim() === '') {
          return of(null);
        }

        return this.ts.searchTribesForGame(this.game, term);
      }),
      shareReplay()
    );
  }
}
