import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GameServerPlayer } from '@supremegaming/common/interfaces';
import { PlayersService } from '@supremegaming/data-access';

import { AbstractSearchListComponent } from '../abstract-search-list/abstract-search-list.component';

@Component({
  selector: 'supremegaming-player-search-list',
  templateUrl: './player-search-list.component.html',
  styleUrls: ['./player-search-list.component.scss'],
})
export class PlayerSearchListComponent extends AbstractSearchListComponent<GameServerPlayer> implements OnInit {
  constructor(public readonly fb: FormBuilder, private readonly ps: PlayersService) {
    super(fb);
  }

  public getData() {
    const { search } = this.form.getRawValue();

    return this.ps.searchPlayersForGame(this.game, search, true);
  }
}
