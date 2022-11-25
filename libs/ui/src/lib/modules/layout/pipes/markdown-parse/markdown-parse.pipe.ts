import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as marked from 'marked';

@Pipe({
  name: 'markdownParse',
})
export class MarkdownParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(value: string): SafeHtml {
    if (value === undefined || value === null || value === '') {
      return;
    }

    return this.sanitizer.bypassSecurityTrustHtml(marked(value));
  }
}
