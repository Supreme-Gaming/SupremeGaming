import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderItemComponent } from './components/header-item/header-item.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HeaderComponent, SubHeaderComponent, HeaderItemComponent],
  exports: [HeaderComponent, SubHeaderComponent, HeaderItemComponent],
})
export class UiSkeletonModule {}
