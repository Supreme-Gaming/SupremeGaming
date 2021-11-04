import { Component, Input } from '@angular/core';

import { AbstractRoutableResourceComponent } from '../abstract-routable-resource/abstract-routable-resource.component';

@Component({
  template: '',
})
export abstract class AbstractResourceTableComponent<T> extends AbstractRoutableResourceComponent {
  @Input()
  public data: Array<T>;

  @Input()
  public columnsVisible: Array<string>;

  @Input()
  public columnLabels: Array<string>;

  @Input()
  public showCount = true;

  @Input()
  public showAvatar = true;
}
