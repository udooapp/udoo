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
import {OfferComponent} from "../offer/offer.component";
import {RequestComponent} from "../request/request.component";
import {RequestListComponent} from "../requestlist/requestlist.component";
import {OfferListComponent} from "../offerlist/offerlist.component";
import {LocationComponent} from "../location/location.component";
import {TextInputComponent} from "../layout_elements/textinput/textinput.component";
import {AuthGuard} from "../guard/AuthGuard";
import {TokenService} from "../guard/TokenService";
import {TextAreaComponent} from "../layout_elements/textarea/textarea.component";
import {SelectInputComponent} from "../layout_elements/selectinput/selectinput.component";
import {FileInputComponent} from "../layout_elements/fileInput/fileinput.component";
import {ServiceDetailComponent} from "../servicedetail/servicedetail.component";
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    PasswordComponent,
    OfferComponent,
    RequestComponent,
    RequestListComponent,
    OfferListComponent,
    LocationComponent,
    TextInputComponent,
    TextAreaComponent,
    SelectInputComponent,
    FileInputComponent,
    ServiceDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthGuard, TokenService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
