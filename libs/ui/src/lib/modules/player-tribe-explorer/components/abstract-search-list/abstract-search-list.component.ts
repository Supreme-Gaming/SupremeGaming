import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';

import { AbstractResourceTableComponent } from '../abstract-resource-table/abstract-resource-table.component';

@Component({
  template: '',
})
export abstract class AbstractSearchListComponent<D> extends AbstractResourceTableComponent<D> implements OnInit {
  /**
   * Game to restrict player search to. This value is included to the http
   * request so the receiving API must support it.
   */
  @Input()
  public game: string;

  @Input()
  public placeholder: string;

  public form: UntypedFormGroup;

  public searchData: Observable<Array<D>>;

  public searchTerm: Observable<string>;

  constructor(public fb: UntypedFormBuilder) {
    super();
  }

  public ngOnInit() {
    this.form = this.fb.group({
      search: '',
    });

    this.searchTerm = this.form.get('search').valueChanges.pipe(debounceTime(500));

    this.searchData = this.searchTerm.pipe(
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim() === '') {
          return of(null);
        }

        return this.getData();
      }),
      shareReplay()
    );
  }

  public abstract getData(): Observable<Array<D>>;
}
