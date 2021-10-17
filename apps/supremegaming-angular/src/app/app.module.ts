import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import * as WebFont from 'webfontloader';

import { UiSkeletonModule } from '@supremegaming/ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

WebFont.load({
  google: {
    families: ['Material Icons', 'Public Sans:300,400,500,600'],
  },
  custom: {
    families: ['Marvin Visions'],
    urls: ['assets/fonts/MarvinVisions.css'],
  },
});

@NgModule({
  imports: [BrowserModule, AppRoutingModule, UiSkeletonModule, HttpClientModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
