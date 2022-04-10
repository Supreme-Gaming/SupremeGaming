import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { MetaService } from '../../meta.service';

@Component({
  selector: 'supremegaming-metadata',
  template: '',
})
export class MetadataComponent implements OnInit {
  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly meta: MetaService) {}

  public ngOnInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .pipe(
        map((e) => {
          let child = this.route.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }

          if (child.snapshot.data['meta']) {
            return child.snapshot.data['meta'];
          }

          return null;
        }),
        filter((t) => t !== null)
      )
      .subscribe((r) => {
        this.meta.updateMeta(r);
      });
  }
}
