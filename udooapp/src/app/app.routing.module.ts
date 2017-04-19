import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../registration/registration.component';
import {LoginComponent} from '../login/login.component';
import {AppComponent} from './app.component';
import {MapComponent} from '../map/map.component';
import {ProfileComponent} from "../profile/profile.component";
import {PasswordComponent} from "../password/password.component";
import {NewOfferComponent} from "../newoffer/newoffer.component";
import {NewRequestComponent} from "../newrequest/newrequest.component";
import {RequestComponent} from "../requests/request.component";
import {OfferComponent} from "../offers/offers.component";
import {LocationComponent} from "../location/location.component";

const routes: Routes = [
  {path: '', redirectTo: '/map', pathMatch: 'full'},
  {path: 'app', component: AppComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'password', component: PasswordComponent},
  {path: 'addoffer', component: NewOfferComponent},
  {path: 'addrequest', component: NewRequestComponent},
  {path: 'request', component: RequestComponent},
  {path: 'offer', component: OfferComponent},
  {path: 'map', component: MapComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
