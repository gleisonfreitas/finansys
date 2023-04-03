import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatadase } from './in-memory-database';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpInMemoryWebApiModule.forRoot(InMemoryDatadase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
