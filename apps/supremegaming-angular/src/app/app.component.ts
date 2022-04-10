import { Component } from '@angular/core';

import { MetadataComponent } from '@supremegaming/common/ngx';

@Component({
  selector: 'sg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends MetadataComponent {}
