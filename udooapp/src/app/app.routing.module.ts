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
  {path: 'map/internet', component: MapComponent},
  {path: 'map/:id', component: MapComponent},
  {path: 'detail/:id/:type', component: ServiceDetailComponent},
  {path: '**', redirectTo:'/map'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
