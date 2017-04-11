import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {MapComponent} from './map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [MapComponent]
})
export class MapModule {
}
