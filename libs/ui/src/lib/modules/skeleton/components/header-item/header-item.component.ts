import { Component, OnInit, HostListener, HostBinding, ElementRef } from '@angular/core';
import { Observable, fromEvent, of, BehaviorSubject } from 'rxjs';
import { switchMap, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss'],
})
export class HeaderItemComponent implements OnInit {
  @HostBinding('class.active')
  public active = false;

  constructor(private el: ElementRef) {}

  public ngOnInit() {
    fromEvent(this.el.nativeElement, 'mousemove')
      .pipe(
        distinctUntilChanged((old: MouseEvent, latest: MouseEvent) => {
          return (
            (old.target as HTMLElement).tagName === (latest.target as HTMLElement).tagName &&
            (old.target as HTMLElement).classList.toString() === (latest.target as HTMLElement).classList.toString()
          );
        }),
        switchMap((e: MouseEvent) => {
          console.log(`Element change:`, e.target);
          return of((this.el.nativeElement as HTMLElement).contains(e.target as Node));
        })
      )
      .subscribe((res) => {
        this.active = res;
      });
  }
}
