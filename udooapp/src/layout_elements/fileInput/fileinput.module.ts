import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';
import {FileInputComponent} from './fileinput.component';

@NgModule({
  declarations: [
    FileInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [FileInputComponent]
})
export class FileInputModule {
}
