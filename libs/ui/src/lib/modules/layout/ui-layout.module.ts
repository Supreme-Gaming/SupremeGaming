import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentFragmentComponent } from './components/content-fragment/content-fragment.component';
import { MarkdownParsePipe } from './pipes/markdown-parse/markdown-parse.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ContentFragmentComponent, MarkdownParsePipe],
  exports: [ContentFragmentComponent, MarkdownParsePipe],
})
export class UiLayoutModule {}
