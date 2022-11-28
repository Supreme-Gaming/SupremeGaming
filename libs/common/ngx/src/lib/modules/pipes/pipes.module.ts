import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncludesPipe } from './array/includes/includes.pipe';
import { FindByKeyValuePipe } from './array/find-by-key-value/find-by-key-value.pipe';

@NgModule({
  declarations: [IncludesPipe, FindByKeyValuePipe],
  imports: [CommonModule],
  exports: [IncludesPipe, FindByKeyValuePipe],
})
export class PipesModule {}
