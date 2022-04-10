import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'supremegaming-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  public type: 'submit' | 'reset' | 'button' = 'button';

  @Input()
  public display: 'flex' | 'block' | 'inline' = 'inline';

  @HostBinding('class')
  public get getDisplay() {
    return this.display;
  }
}
