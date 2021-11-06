import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private readonly title: Title) {}

  public updateMeta(metadata: PageMetadata) {
    this.title.setTitle(metadata.title);
  }
}

interface PageMetadata {
  title: string;
}
