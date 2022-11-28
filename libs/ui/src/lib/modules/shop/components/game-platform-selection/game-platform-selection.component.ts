import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IDonationGame } from '../../interfaces/shop.interfaces';

@Component({
  selector: 'supremegaming-game-platform-selection',
  templateUrl: './game-platform-selection.component.html',
  styleUrls: ['./game-platform-selection.component.scss'],
})
export class GamePlatformSelectionComponent {
  @Output() public gameSelected = new EventEmitter<IDonationGame>();

  @Input() public savedGame: IDonationGame;

  public games: Array<IDonationGame> = [
    {
      name: 'ATLAS',
      iconPath: 'assets/images/games/atlas.png',
      value: 'atlas',
    },
    {
      name: 'Ark',
      iconPath: 'assets/images/games/ark.png',
      value: 'ark',
    },
  ];

  public setActiveGame(game: IDonationGame) {
    this.gameSelected.emit(game);
  }
}
