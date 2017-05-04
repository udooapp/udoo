import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {SelectInputComponent} from './selectinput.component';

@NgModule({
  declarations: [
    SelectInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [SelectInputComponent]
})
export class SelectInputModule {
}
