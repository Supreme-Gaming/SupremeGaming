import { Component, Input } from '@angular/core';

@Component({
  template: '',
})
export class AbstractRoutableResourceComponent {
  /**
   * Base route where the character name link will redirect to
   */
  @Input()
  public playerDetailsRoute: string;

  /**
   * Base route where the tribe name link will redirect to
   */
  @Input()
  public tribeDetailsRoute: string;
}
