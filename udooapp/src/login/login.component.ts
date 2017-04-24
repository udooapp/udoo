import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../input/validation.component";
import {log} from "util";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, ValidationComponent]
})
export class LoginComponent {
  message: String;
  user = new User(null, '', '', '', '', '', 0, '');
  error: string;

  constructor(private userService: UserService, private validation: ValidationComponent) {
  }

  login() {
    if (this.validation.checkValidation()) {
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
}
