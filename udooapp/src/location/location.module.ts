import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {LocationComponent} from './location.component';
import {AppRoutingModule} from "../app/app.routing.module";

@NgModule({
  declarations: [
    LocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [LocationComponent]
})
export class MapModule {
}
