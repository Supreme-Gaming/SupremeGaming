import { Component, OnInit } from '@angular/core';

import { EnvironmentService } from '@supremegaming/common/ngx';

@Component({
  selector: 'supremegaming-ark-overview',
  templateUrl: './ark-overview.component.html',
  styleUrls: ['./ark-overview.component.scss'],
})
export class ArkOverviewComponent implements OnInit {
  constructor(private env: EnvironmentService) {}

  public ngOnInit() {
    this.env.value<{ x: string }>('x');
  }
}
