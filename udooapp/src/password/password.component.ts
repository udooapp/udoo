import {Component} from '@angular/core';


import {UserService} from "../services/user.service";
import {IValidator} from "../validator/validator.interface";
import {PasswordValidator} from "../validator/password.validator";
import {EmptyValidator} from "../validator/empty.validator";
import {NotifierService} from "../services/notify.service";
import {Router} from "@angular/router";
import {AppRoutingModule} from "../app/app.routing.module";

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService,]
})
export class PasswordComponent {
  private static NAME: string = 'Password';
  message: String;
  error = '';
  password = '';
  currentpassword = '';
  valid = [false, false];
  passwordValidator: IValidator = new PasswordValidator();
  emptyValidator: IValidator = new EmptyValidator();

  constructor(private userService: UserService, private notifier: NotifierService, private router: Router) {
    notifier.notify(PasswordComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == PasswordComponent.NAME) {
        router.navigate([AppRoutingModule.PROFILE]);
      }
    })
  }

  private checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        return false;
      }
    }
    return true;
  }

  public save() {
    if (this.checkValidation()) {
      this.userService.changePassword(this.currentpassword, this.password).subscribe(
        message => this.message = message,
        error => {
          this.error = (<any>error).toString().match(/[0-9]{3}/) ? (<any>error).toString().match('401') ? 'Incorrect emailAddress' : 'Please try again later' : <any>error;
          this.notifier.notifyError(error.toString());
        });
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
