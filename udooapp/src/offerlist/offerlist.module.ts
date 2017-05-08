import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {OfferListComponent} from './offerlist.component';

@NgModule({
  declarations: [
    OfferListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [OfferListComponent]
})
export class OfferModule {
}
