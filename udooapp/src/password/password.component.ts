import {Component} from '@angular/core';


import {UserService} from "../services/user.service";
import {IValidator} from "../validator/validator.interface";
import {PasswordValidator} from "../validator/password.validator";
import {EmptyValidator} from "../validator/empty.validator";

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService,]
})
export class PasswordComponent {
  message: String;
  error = '';
  password = '';
  currentpassword = '';
  valid = [false, false];
  passwordValidator: IValidator = new PasswordValidator();
  emptyValidator: IValidator = new EmptyValidator();

  constructor(private userService: UserService) {
  }

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        return false;
      }
    }
    return true;
  }

  save() {
    if (this.checkValidation()) {
      this.userService.changePassword(this.currentpassword, this.password).subscribe(
        message => this.message = message,
        error => this.error =  (<any>error).toString().match(/[0-9]{3}/) ? (<any>error).toString().match('401') ? 'Incorrect password' : 'Please try again later' : <any>error);
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
