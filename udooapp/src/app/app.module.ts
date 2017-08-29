import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {MainComponent} from '../screens/main/main.component';
import {RegistrationComponent} from '../screens/registration/registration.component';
import {LoginComponent} from '../screens/login/login.component';
import {AppRoutingModule} from './app.routing.module';
import {ProfileComponent} from "../screens/profile/profile.component";
import {PasswordComponent} from "../screens/password/password.component";
import {OfferComponent} from "../screens/offer/offer.component";
import {RequestComponent} from "../screens/request/request.component";
import {RequestListComponent} from "../screens/requestlist/requestlist.component";
import {OfferListComponent} from "../screens/offerlist/offerlist.component";
import {LocationWindowComponent} from "../screens/location/location.component";
import {TextInputFieldComponent} from "../fields/textinput/textinput.component";
import {AuthGuard} from "../guard/auth.guard";
import {TokenService} from "../services/token.service";
import {TextAreaFieldComponent} from "../fields/textarea/textarea.component";
import {SelectInputFieldComponent} from "../fields/selectinput/selectinput.component";
import {FileInputFieldComponent} from "../fields/fileInput/fileinput.component";
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
import {TextInputSelectFieldComponent} from "../fields/textinputselect/textinputselect.component";
import {DialogController} from "../controllers/dialog.controller";
import {DialogWindowComponent} from "../components/dialog/dialog.component";
import {GalleryComponent} from "../components/gallery/gallery.component";
import {ServiceDialogComponent} from "../components/service/service.window.component";
import {ServiceDialogController} from "../components/service/service.window.controller";
import {BidDialogComponent} from "../components/bid/bid.window.component";
import {BidComponent} from "../screens/bids/bids.component";
import {MainListComponent} from "../screens/main/list/list.main.component";
import {MainMapComponent} from "../screens/main/map/map.main.component";
import {MainWallComponent} from "../screens/main/wall/wall.main.component";
import {MapMainController} from "../screens/main/map/map.main.controller";
import {ListMainController} from "../screens/main/list/list.main.controller";
import {SearchController} from "../controllers/search.controller";
import {ToolbarSearchComponent} from "../components/seach/toolbar.search.component";
import {MenuController} from "../controllers/menu.controller";
import {UserController} from "../controllers/user.controller";
import {ConversationComponent} from "../screens/conversations/conversations.component";
import {ChatComponent} from "../screens/chat/chat.component";
import {BookmarkComponent} from "../screens/bookmarks/bookmark.component";
import {CheckboxFieldComponent} from "../fields/checkbox/checkbox.component";
import {AvailabilityFieldComponent} from "../fields/availability/availability.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    PasswordComponent,
    OfferComponent,
    RequestComponent,
    RequestListComponent,
    OfferListComponent,
    ContactsComponent,
    LocationWindowComponent,
    TextInputFieldComponent,
    TextAreaFieldComponent,
    TextInputSelectFieldComponent,
    SelectInputFieldComponent,
    FileInputFieldComponent,
    CheckboxFieldComponent,
    AvailabilityFieldComponent,
    ServiceDetailComponent,
    ReminderComponent,
    VerificationComponent,
    FirstLoginComponent,
    MenuComponent,
    DialogWindowComponent,
    SettingsComponent,
    ActivationComponent,
    GalleryComponent,
    ServiceDialogComponent,
    BidDialogComponent,
    BidComponent,
    MainListComponent,
    MainMapComponent,
    MainWallComponent,
    ToolbarSearchComponent,
    ConversationComponent,
    ChatComponent,
    BookmarkComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [UserController, AuthGuard, TokenService, NotifierController, UserService, SearchController, DialogController, UserService, ServiceDialogController, MapMainController, ListMainController, MenuController],
  bootstrap: [AppComponent]
})
export class AppModule {
}
