import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../textinput/validation.component";
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

  constructor(private router: Router, private userService: UserService, private validation: ValidationComponent) {
  }

  login() {
    if (this.validation.checkValidation()) {
      this.error = '';
      let err: string ='';
      this.userService.loginUser(this.user)
        .subscribe(
          message => {
            if(message.length == 0){
            this.router.navigate(['/map']);
            } else {
              err += message;
              this.error = err.match(/[0-9]{3}/) ? err.match('401') ? 'Incorrect email or password' : 'Please try again later' : err;
            }
          },
          error => {
            err += error;
            this.error = err.match(/[0-9]{3}/) ? err.match('401') ? 'Incorrect email or password' : 'Please try again later' : err;
          }
        );
    }
  }
}
