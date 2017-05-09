import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {RequestComponent} from './request.component';
import {LocationComponent} from "../location/location.component";

@NgModule({
  declarations: [
    RequestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [RequestComponent]
})
export class NewRequestModule {
}
