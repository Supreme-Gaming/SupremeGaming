import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import * as WebFont from 'webfontloader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrameModule } from './modules/frame/frame.module';

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
  imports: [BrowserModule, AppRoutingModule, FrameModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
