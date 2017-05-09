import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {ServiceDetailComponent} from './servicedetail.component';
import {AppRoutingModule} from "../app/app.routing.module";

@NgModule({
  declarations: [
    ServiceDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ServiceDetailComponent]
})
export class ServiceDetailModule {
}
