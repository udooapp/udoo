import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {IValidator} from "../validator/validator.interface";
import {EmailValidator} from "../validator/email.validator";
import {PasswordValidator} from "../validator/password.validator";
import {EmptyValidator} from "../validator/empty.validator";
import {NotifierService} from "../services/notify.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent {
  message: String;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  error: string;
  emptyValidator : IValidator = new EmptyValidator();
  emailValidator : IValidator = new EmailValidator();
  passwordValidator : IValidator = new PasswordValidator();
  valid = [false, false];
  constructor(private router: Router, private userService: UserService, private notifier: NotifierService) {

  }

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        return false;
      }
    }
    return true;
  }
  login() {
    if (this.checkValidation()) {
      this.error = '';
      let err: string ='';
      this.userService.loginUser(this.user)
        .subscribe(
          message => {
            if(message.length == 0){
            this.router.navigate(['/map']);
            } else {
              err += message;
              this.error = err.match(/[0-9]{3}/) ? err.match('401') ? 'Incorrect email or password' : 'Please try again later' : err === "Unauthorized" ? 'Incorrect email or password' : err;
            }
          },
          error => {
            err += error;
            this.notifier.notifyError(err);
            this.error = err.match(/[0-9]{3}/) ? err.match('401') ? 'Incorrect email or password' : 'Please try again later' :  err === "Unauthorized" ? 'Incorrect email or password' : err;
          }
        );
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
