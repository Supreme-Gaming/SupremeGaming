import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ContentFragmentComponent } from './components/content-fragment/content-fragment.component';
import { MarkdownParsePipe } from './pipes/markdown-parse.pipe';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [ContentFragmentComponent, MarkdownParsePipe],
  exports: [ContentFragmentComponent, MarkdownParsePipe],
})
export class ParsingModule {}
