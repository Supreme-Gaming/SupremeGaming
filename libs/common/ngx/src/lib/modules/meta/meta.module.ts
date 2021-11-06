import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetaService } from './meta.service';
import { MetadataComponent } from './components/metadata/metadata.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MetadataComponent],
  providers: [MetaService],
})
export class MetaModule {}
