import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../../entity/user';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {IValidator} from "../../validator/validator.interface";
import {EmailValidator} from "../../validator/email.validator";
import {PasswordValidator} from "../../validator/password.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {NotifierService} from "../../services/notify.service";
import {MAP} from "../../app/app.routing.module";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent {
  message: String;
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en');
  error: string;
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  passwordValidator: IValidator = new PasswordValidator();
  valid = [false, false];

  constructor(private router: Router, private userService: UserService, private notifier: NotifierService) {

  }

  private checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        return false;
      }
    }
    return true;
  }

  public login() {
    if (this.checkValidation()) {
      this.error = '';
      this.userService.loginUser(this.user)
        .subscribe(
          message =>
            this.router.navigate([MAP]),
          error => {
            this.notifier.notifyError(error);
            this.error = error;
          }
        );
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
