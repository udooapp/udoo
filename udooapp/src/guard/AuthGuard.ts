
import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {AppRoutingModule} from "../app/app.routing.module";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('token')) {
      return true;
    }
    this.router.navigate([AppRoutingModule.LOGIN]);
    return false;
  }
}
