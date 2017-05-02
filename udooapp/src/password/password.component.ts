import {Component} from '@angular/core';


import {UserService} from "../services/user.service";
import {ValidationComponent} from "../input/validation.component";

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService, ValidationComponent]
})
export class PasswordComponent {
  message: String;
  userId = 2;
  error = '';
  password = '';
  currentpassword='';

  constructor(private userService: UserService, private validation : ValidationComponent) {
  }

  save() {
    if(this.validation.checkValidation()) {
      this.userService.changePassword(this.currentpassword, this.password, this.userId).subscribe(
        message => this.message = message,
        error => this.error = <any>error);
    }
  }
}
