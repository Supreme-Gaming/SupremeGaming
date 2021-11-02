import { Component, Input } from '@angular/core';

@Component({
  template: '',
})
export abstract class AbstractResourceTableComponent<T> {
  @Input()
  public data: Array<T>;

  @Input()
  public abstract columnsVisible: Array<string>;

  @Input()
  public columnLabels: Array<string>;

  @Input()
  public showCount = true;
}
