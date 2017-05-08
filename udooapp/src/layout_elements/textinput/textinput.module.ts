import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {TextInputComponent} from './textinput.component';

@NgModule({
  declarations: [
    TextInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [TextInputComponent]
})
export class TextInputModule {
}
