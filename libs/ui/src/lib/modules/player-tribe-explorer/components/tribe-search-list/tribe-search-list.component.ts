import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GameServerTribe } from '@supremegaming/common/interfaces';
import { TribesService } from '@supremegaming/data-access';

import { AbstractSearchListComponent } from '../abstract-search-list/abstract-search-list.component';

@Component({
  selector: 'supremegaming-tribe-search-list',
  templateUrl: './tribe-search-list.component.html',
  styleUrls: ['./tribe-search-list.component.scss'],
})
export class TribeSearchListComponent extends AbstractSearchListComponent<GameServerTribe> implements OnInit {
  constructor(public readonly fb: FormBuilder, public readonly ts: TribesService) {
    super(fb);
  }

  public getData() {
    const { search } = this.form.getRawValue();

    return this.ts.searchTribesForGame(this.game, search);
  }
}
