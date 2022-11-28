import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, iif, merge, Observable, of } from 'rxjs';
import {
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  startWith,
  withLatestFrom,
  tap,
} from 'rxjs/operators';

import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { PlayersService } from '@supremegaming/data-access';

@Component({
  selector: 'supremegaming-donation-recipient-selection',
  templateUrl: './donation-recipient-selection.component.html',
  styleUrls: ['./donation-recipient-selection.component.scss'],
})
export class DonationRecipientSelectionComponent implements OnInit {
  @Input()
  public game: string;

  /**
   * If the user has selected a result and the display value patched, the next edit on the input
   * will cause the entire clear the input in one key stroke.
   */
  @Input()
  public clearSearchOnInvalidation = false;

  @Output()
  public selectedRecipient: EventEmitter<GameServerPlayer> = new EventEmitter();

  @ViewChild('searchContainer', { static: true })
  public searchContainer: ElementRef;

  @ViewChild('searchResultsContainer', { static: true })
  public searchResultsContainer: ElementRef;

  public searchTerm: FormControl = new FormControl('');

  public searchResults: Observable<Array<GameServerPlayer>>;

  public focused: Observable<boolean>;
  public lastSet: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private readonly ps: PlayersService) {}

  public ngOnInit() {
    const termChange = this.searchTerm.valueChanges.pipe(shareReplay());

    // Immediately map out an empty array every time the term changes
    // This will make it so the results list is not visible while the user is typing or there is an ongoing network request
    this.searchResults = merge(
      termChange.pipe(
        withLatestFrom(this.lastSet),
        // This following `tap` side effect enables the setting `clearSearchOnInvalidation`
        //
        // If the user has selected a participant, that value will be present in state.
        // After a user selects a result, further modification of the search term should render the last state invalid which should
        // trigger a clearRecipient state and push that value to the parent. Without this check, the component would emit a value more often than needed.
        tap(([currentTerm, lastSetTerm]) => {
          if (lastSetTerm && currentTerm !== lastSetTerm) {
            this.clearRecipient();
          }
        }),
        // On every new term change, we want to to clear the saved recipient
        map(() => [])
      ),
      termChange.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        // When a user selects a result from the list. The value of the input will be set to the value of the selected result
        // When this happens, we don't want to make a network request, so we check if the value of the input is the same as the last value (user-selected value) we set
        // If it is, we don't make a network request and simply return an empty array which will clear the results list
        withLatestFrom(this.lastSet),
        switchMap(([nowTerm, lastTerm]) =>
          iif(
            () => nowTerm.length > 0 && nowTerm !== lastTerm,
            this.ps.searchPlayersForGame(this.game, nowTerm).pipe(map((players) => players.slice(0, 10))),
            of([])
          )
        ),
        shareReplay()
      )
    );

    // When the user clicks on the input, we want to show the results list, even if there are no results
    // Because the results list doesn't appear until the searchResults observable emits a value
    //
    // All the focus events emit an initial value of false and emit `true` when the event represents a in-element focus and `false` when the event represents a out-of-element focus.
    //
    // Search container focus events
    const searchContainerFocusIn = fromEvent(this.searchContainer.nativeElement, 'focusin').pipe(
      map(() => true),
      startWith(false)
    );
    const searchContainerFocusOut = fromEvent(this.searchContainer.nativeElement, 'focusout').pipe(
      map(() => false),
      startWith(false)
    );

    // Search results container focus events
    const searchResultsContainerFocusIn = fromEvent(this.searchResultsContainer.nativeElement, 'focusin').pipe(
      map(() => true),
      startWith(false)
    );
    const searchResultsContainerFocusOut = fromEvent(this.searchResultsContainer.nativeElement, 'focusout').pipe(
      map(() => false),
      startWith(false)
    );

    // Search results container mouse events
    //
    // These are needed because a mouse click event does not trigger a focus event so while the user is mousing down on the results list, the results list will persist
    // until the user clicks outside of the results list to select a result
    const searchResultsContainerMouseDown = fromEvent(this.searchResultsContainer.nativeElement, 'mousedown').pipe(
      map(() => true),
      startWith(false)
    );
    const searchResultsContainerMouseUp = fromEvent(this.searchResultsContainer.nativeElement, 'mouseup').pipe(
      map(() => false),
      startWith(false)
    );

    // Two sets of element focus events are needed because the search results container does not preserver the focus state when the user clicks on a result.
    // For each of these, the last emitted value is always an out-of-element focus event
    const focusedSearchContainer = merge(searchContainerFocusIn, searchContainerFocusOut);
    const focusedSearchResultsContainer = merge(
      searchResultsContainerFocusIn,
      searchResultsContainerFocusOut,
      searchResultsContainerMouseDown,
      searchResultsContainerMouseUp
    );

    // If both of the last emissions are false, then the user is no longer focused on either the search container or the search results container
    // and we can hide the results list
    this.focused = combineLatest([focusedSearchContainer, focusedSearchResultsContainer]).pipe(
      map((v) => {
        return v.some((x) => x === true);
      }),
      distinctUntilChanged(),
      shareReplay()
    );
  }

  public selectRecipient(player: GameServerPlayer) {
    const v = `${player.CharacterName} (${player.TribeName}) - ${player.PlayMap}`;

    this.lastSet.next(v);
    this.searchTerm.patchValue(v);
    this.selectedRecipient.emit(player);
  }

  public clearRecipient() {
    this.lastSet.next(null);

    if (this.clearSearchOnInvalidation) {
      this.searchTerm.patchValue(null);
    }

    this.selectedRecipient.emit(null);
  }
}
