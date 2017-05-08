import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {TextAreaComponent} from "./textarea.component";

@NgModule({
  declarations: [
    TextAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [TextAreaComponent]
})
export class TextAreaModule {
}
