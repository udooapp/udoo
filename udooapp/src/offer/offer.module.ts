import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {OfferComponent} from './offer.component';
import {LocationComponent} from "../location/location.component";

@NgModule({
  declarations: [
    OfferComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [OfferComponent]
})
export class NewOfferModule {
}