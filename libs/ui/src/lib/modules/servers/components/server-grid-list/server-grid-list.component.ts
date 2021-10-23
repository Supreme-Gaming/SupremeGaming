import { Component, Input, OnInit } from '@angular/core';

import { GameServer } from '@supremegaming/common/interfaces';

@Component({
  selector: 'supremegaming-server-grid-list',
  templateUrl: './server-grid-list.component.html',
  styleUrls: ['./server-grid-list.component.scss'],
})
export class ServerGridListComponent implements OnInit {
  /**
   * List of servers, in sequential column/row order.
   */
  @Input()
  public servers: Array<GameServer>;

  /**
   * An array of stringified numbers, the total of which represents the number of
   * rows on the grid.
   */
  public rows: Array<string>;

  /**
   * An array of letters, the total of which represents the number of columns on the grid.
   */
  public columns: Array<string>;

  public ngOnInit() {
    this.columns = this.servers.reduce((acc, curr) => {
      // All grid names start with a single letter.
      const columnPrefix = curr.map_name.slice(0, 1);
      const alreadyIndexed = acc.includes(columnPrefix);

      if (alreadyIndexed === false) {
        return [...acc, columnPrefix];
      }

      return acc;
    }, []);

    this.rows = this.servers.reduce((acc, curr) => {
      const rowNumber = curr.map_name.slice(1);
      const alreadyIndexed = acc.includes(rowNumber);

      if (alreadyIndexed === false) {
        return [...acc, rowNumber];
      }

      return acc;
    }, []);
  }
}
