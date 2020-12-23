import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'content-fragment',
  templateUrl: './content-fragment.component.html',
  styleUrls: ['./content-fragment.component.scss'],
})
export class ContentFragmentComponent implements OnInit {
  @Input()
  public url: string;

  public content: Observable<string>;

  constructor(private http: HttpClient) {}

  public ngOnInit() {
    this.content = this.http.get(this.url, { responseType: 'text' });
  }
}
