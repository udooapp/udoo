import {Component} from '@angular/core';


import {UserService} from "../../services/user.service";
import {IValidator} from "../../validator/validator.interface";
import {PasswordValidator} from "../../validator/password.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {NotifierController} from "../../controllers/notify.controller";
import {Router} from "@angular/router";
import {PROFILE} from "../../app/app.routing.module";
import {DialogController} from "../../controllers/dialog.controller";

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

  constructor(private userService: UserService, private notifier: NotifierController, private router: Router, private dialog: DialogController) {
    notifier.notify(PasswordComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == PasswordComponent.NAME) {
        router.navigate([PROFILE]);
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
        message => {this.message = message; this.error = '';},
        error => {
          this.message = '';
          this.error = (<any>error).toString().match(/[0-9]{3}/) ? (<any>error).toString().match('401') ? 'Incorrect password' : 'Please try again later' : <any>error;
          this.dialog.notifyError(error.toString());
        });
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
