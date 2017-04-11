import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent} from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import {AppComponent} from './app.component';
import {MapComponent} from '../map/map.component';
const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'app', component: AppComponent},
  { path: 'registration',  component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent}
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
