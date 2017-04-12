import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NewOfferComponent} from './newoffer.component';

@NgModule({
  declarations: [
    NewOfferComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [NewOfferComponent]
})
export class NewOfferModule {
}
