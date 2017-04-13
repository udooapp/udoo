import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {UserService} from "../entity/user.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent {
  message: String;
  user = new User(null, '', '', '', '', '', false, '');
  error : string;

  constructor(private userService: UserService) {
  }

  login() {
    if (this.user.email.length === 0) {
      this.error = 'Username is empty!';
    } else if (this.user.password.length === 0) {
      this.error = 'Password is empty!';
    } else {
      this.userService.loginUser(this.user).subscribe(
        message => this.message = message,
        error => this.error = <any>error);
    }
  }
}
