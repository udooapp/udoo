import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {RequestListComponent} from './requestlist.component';

@NgModule({
  declarations: [
    RequestListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [RequestListComponent]
})
export class RequestModule {
}
