import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../registration/registration.component';
import {LoginComponent} from '../login/login.component';
import {MapComponent} from '../map/map.component';
import {ProfileComponent} from "../profile/profile.component";
import {PasswordComponent} from "../password/password.component";
import {OfferComponent} from "../offer/offer.component";
import {RequestComponent} from "../request/request.component";
import {RequestListComponent} from "../requestlist/requestlist.component";
import {OfferListComponent} from "../offerlist/offerlist.component";
import {AuthGuard} from "../guard/AuthGuard";
import {ServiceDetailComponent} from "../servicedetail/servicedetail.component";
import {ContactsComponent} from "../contacts/contact.component";
import {puts} from "util";
import {ReminderComponent} from "../reminder/reminder.component";
import {VerificationComponent} from "../verification/verification.component";
import {FirstLoginComponent} from "../firstlogin/firstlogin.component";

const routes: Routes = [
  {path: '', redirectTo: '/map', pathMatch: 'full'},
  {path: 'registration', component: RegistrationComponent},
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
  {path: 'map', component: MapComponent},
  {path: 'reminder', component: ReminderComponent},
  {path: 'reminder/:token', component: ReminderComponent},
  {path: 'verification/:token', component: VerificationComponent},
  {path: 'verification', component: VerificationComponent},
  {path: 'contact', component: ContactsComponent, canActivate: [AuthGuard]},
  {path: 'detail/:id/:type', component: ServiceDetailComponent},
  {path: 'create', component: FirstLoginComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo:'/map'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public static LOGIN: string = '/login';
  public static REGISTRATION: string = '/registration';
  public static PROFILE: string = '/profile';
  public static PASSWORD: string = '/data';
  public static OFFER: string = '/offer';
  public static REQUEST: string = '/request';
  public static OFFER_TYPE: string = '/offer/';
  public static REQUEST_TYPE: string = '/request/';
  public static REQUEST_LIST: string = '/requestlist';
  public static OFFER_LIST: string = '/offerlist';
  public static MAP: string = '/map';
  public static CONTACT: string = '/contact';
  public static DETAIL: string = '/detail/';
  public static REMINDER: string = '/reminder';
  public static VERIFICATION: string = '/verification';
  public static CREATE: string = '/create';
}
