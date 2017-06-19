import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {MapComponent} from '../screens/map/map.component';
import {RegistrationComponent} from '../screens/registration/registration.component';
import {LoginComponent} from '../screens/login/login.component';
import {AppRoutingModule} from './app.routing.module';
import {ProfileComponent} from "../screens/profile/profile.component";
import {PasswordComponent} from "../screens/password/password.component";
import {OfferComponent} from "../screens/offer/offer.component";
import {RequestComponent} from "../screens/request/request.component";
import {RequestListComponent} from "../screens/requestlist/requestlist.component";
import {OfferListComponent} from "../screens/offerlist/offerlist.component";
import {LocationComponent} from "../screens/location/location.component";
import {TextInputComponent} from "../fields/textinput/textinput.component";
import {AuthGuard} from "../guard/auth.guard";
import {TokenService} from "../services/token.service";
import {TextAreaComponent} from "../fields/textarea/textarea.component";
import {SelectInputComponent} from "../fields/selectinput/selectinput.component";
import {FileInputComponent} from "../fields/fileInput/fileinput.component";
import {ServiceDetailComponent} from "../screens/servicedetail/servicedetail.component";
import {ContactsComponent} from "../screens/contacts/contact.component";
import {NotifierController} from "../controllers/notify.controller";
import {ReminderComponent} from "../screens/reminder/reminder.component";
import {VerificationComponent} from "../screens/verification/verification.component";
import {FirstLoginComponent} from "../screens/firstlogin/firstlogin.component";
import {MenuComponent} from "../components/menu/menu.component";
import {SettingsComponent} from "../screens/settings/settings.component";
import {ActivationComponent} from "../screens/activation/activation.component";
import {UserService} from "../services/user.service";

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
    ContactsComponent,
    LocationComponent,
    TextInputComponent,
    TextAreaComponent,
    SelectInputComponent,
    FileInputComponent,
    ServiceDetailComponent,
    ReminderComponent,
    VerificationComponent,
    FirstLoginComponent,
    MenuComponent,
    SettingsComponent,
    ActivationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthGuard, TokenService, NotifierController, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
