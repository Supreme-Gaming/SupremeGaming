import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncludesPipe } from './array/includes.pipe';

@NgModule({
  declarations: [IncludesPipe],
  imports: [CommonModule],
  exports: [IncludesPipe],
})
export class PipesModule {}
