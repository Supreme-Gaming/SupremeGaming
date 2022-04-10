import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private readonly title: Title, private readonly meta: Meta) {}

  public updateMeta(metadata: PageMetadata) {
    const ogTags: Array<MetaDefinition> = [];

    if (metadata.title) {
      this.title.setTitle(metadata.title);
      ogTags.push({
        content: metadata.title,
        property: 'og:title',
      });
    }

    if (metadata.description) {
      ogTags.push({
        content: metadata.description,
        property: 'description',
      });

      ogTags.push({
        content: metadata.description,
        property: 'og:description',
      });
    }

    if (metadata.image)
      [
        ogTags.push({
          content: metadata.image,
          property: 'og:image',
        }),
      ];

    ogTags.forEach((t) => {
      this.meta.updateTag(t);
    });
    // this.meta.updateTag(ogTags);
  }
}

interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: Array<string>;
  image?: string;
}
