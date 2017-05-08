import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../registration/registration.component';
import {LoginComponent} from '../login/login.component';
import {MapComponent} from '../map/map.component';
import {ProfileComponent} from "../profile/profile.component";
import {PasswordComponent} from "../password/password.component";
import {NewOfferComponent} from "../newoffer/newoffer.component";
import {NewRequestComponent} from "../newrequest/newrequest.component";
import {RequestListComponent} from "../requestlist/requestlist.component";
import {OfferListComponent} from "../offerlist/offerlist.component";
import {AuthGuard} from "../guard/AuthGuard";

const routes: Routes = [
  {path: '', redirectTo: '/map', pathMatch: 'full'},
  {path: 'registration', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/1', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]},
  {path: 'addoffer', component: NewOfferComponent, canActivate: [AuthGuard]},
  {path: 'addrequest', component: NewRequestComponent, canActivate: [AuthGuard]},
  {path: 'request', component: RequestListComponent, canActivate: [AuthGuard]},
  {path: 'offer', component: OfferListComponent, canActivate: [AuthGuard]},
  {path: 'map', component: MapComponent},
  {path: 'map/internet', component: MapComponent},
  {path: '**', redirectTo:'/map'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
