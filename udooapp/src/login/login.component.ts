import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../input/validation.component";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, ValidationComponent]
})
export class LoginComponent {
  message: String;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  error: string;

  constructor( private router: Router, private userService: UserService, private validation: ValidationComponent) {
  }

  login() {
    if (this.validation.checkValidation()) {
      this.userService.loginUser(this.user).subscribe(
        result => {
          if(result) {
            this.message = 'Success';
            this.router.navigate(['/map']);
          } else {
            this.error = "Email or password not match"
          }
        },
      );
    }
  }
}
