import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { CopyComponent } from './components/copy/copy.component';

@NgModule({
  imports: [CommonModule, ClipboardModule],
  declarations: [CopyComponent],
  exports: [CopyComponent],
})
export class InteractionsModule {}
