import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {MapComponent} from '../map/map.component';
import {RegistrationComponent} from '../registration/registration.component';
import {LoginComponent} from '../login/login.component';
import {AppRoutingModule} from './app.routing.module';
import {ProfileComponent} from "../profile/profile.component";
import {PasswordComponent} from "../password/password.component";
import {NewOfferComponent} from "../newoffer/newoffer.component";
import {NewRequestComponent} from "../newrequest/newrequest.component";
import {RequestComponent} from "../requests/request.component";
import {OfferComponent} from "../offers/offers.component";
import {LocationComponent} from "../location/location.component";
import {InputComponent} from "../input/input.component";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    PasswordComponent,
    NewOfferComponent,
    NewRequestComponent,
    RequestComponent,
    OfferComponent,
    LocationComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
