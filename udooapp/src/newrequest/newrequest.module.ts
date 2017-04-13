import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NewRequestComponent} from './newrequest.component';

@NgModule({
  declarations: [
    NewRequestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [NewRequestComponent]
})
export class NewRequestModule {
}
