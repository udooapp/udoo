import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../screens/registration/registration.component';
import {LoginComponent} from '../screens/login/login.component';
import {MainComponent} from '../screens/main/main.component';
import {ProfileComponent} from "../screens/profile/profile.component";
import {PasswordComponent} from "../screens/password/password.component";
import {OfferComponent} from "../screens/offer/offer.component";
import {RequestComponent} from "../screens/request/request.component";
import {RequestListComponent} from "../screens/requestlist/requestlist.component";
import {OfferListComponent} from "../screens/offerlist/offerlist.component";
import {AuthGuard} from "../guard/auth.guard";
import {ServiceDetailComponent} from "../screens/servicedetail/servicedetail.component";
import {ContactsComponent} from "../screens/contacts/contact.component";
import {ReminderComponent} from "../screens/reminder/reminder.component";
import {VerificationComponent} from "../screens/verification/verification.component";
import {FirstLoginComponent} from "../screens/firstlogin/firstlogin.component";
import {SettingsComponent} from "../screens/settings/settings.component";
import {ActivationComponent} from "../screens/activation/activation.component";
import {BidComponent} from "../screens/bids/bids.component";
import {ConversationComponent} from "../screens/conversations/conversations.component";
import {ChatComponent} from "../screens/chat/chat.component";

const routes: Routes = [
  {path: 'registration', component: RegistrationComponent},
  {path: 'registration/:facebook', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/1', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]},
  {path: 'offer', component: OfferComponent, canActivate: [AuthGuard]},
  {path: 'request', component: RequestComponent, canActivate: [AuthGuard]},
  {path: 'offer/:id/:type', component: OfferComponent, canActivate: [AuthGuard]},
  {path: 'request/:id/:type', component: RequestComponent, canActivate: [AuthGuard]},
  {path: 'requestlist', component: RequestListComponent, canActivate: [AuthGuard]},
  {path: 'offerlist', component: OfferListComponent, canActivate: [AuthGuard]},
  {path: '', component: MainComponent},
  {path: 'reminder', component: ReminderComponent},
  {path: 'reminder/:token', component: ReminderComponent},
  {path: 'verification/:token', component: VerificationComponent},
  {path: 'verification', component: VerificationComponent},
  {path: 'contact', component: ContactsComponent, canActivate: [AuthGuard]},
  {path: 'detail/:id/:type/:page', component: ServiceDetailComponent},
  {path: 'create', component: FirstLoginComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'create', component: FirstLoginComponent, canActivate: [AuthGuard]},
  {path: 'bids', component: BidComponent, canActivate: [AuthGuard]},
  {path: 'activation', component: ActivationComponent, canActivate: [AuthGuard]},
  {path: 'chat', component: ConversationComponent, canActivate: [AuthGuard]},
  {path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

