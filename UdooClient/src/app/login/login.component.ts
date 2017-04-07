import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../user/user'
import {LoginService} from './login.service'

@Component({
  selector: 'login-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent {
  message = this.loginService.response;
  user = new User(null, '', '', '', '', '');
  error = '';

  constructor(public loginService: LoginService) {
  }

  login() {
    if (this.user.name.length == 0) {
      this.error = "Username is empty!";
    } else if (this.user.password.length == 0) {
      this.error = "Password is empty!";
    } else {
      this.loginService.loginUser(this.user);
      this.error = "";
    }
  }
}
