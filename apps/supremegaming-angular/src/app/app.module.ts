import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import * as WebFont from 'webfontloader';

import { EnvironmentModule } from '@supremegaming/common/ngx';
import { UiSkeletonModule } from '@supremegaming/ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

WebFont.load({
  google: {
    families: ['Material Icons', 'Material Icons Outlined', 'Public Sans:300,400,500,600'],
  },
  custom: {
    families: ['Marvin Visions'],
    urls: ['assets/fonts/MarvinVisions.css'],
  },
});

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiSkeletonModule,
    HttpClientModule,
    EnvironmentModule.forRoot(environment),
    HttpClientModule,
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
