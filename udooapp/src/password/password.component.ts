import {Component} from '@angular/core';


import {User} from '../entity/user';
import {UserService} from "../services/user.service";

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService]
})
export class PasswordComponent {
  message: String;
  userId = 2;
  error = '';
  password = '';
  currentpassword='';

  constructor(private userService: UserService) {
  }

  save() {
    this.userService.changePassword(this.currentpassword, this.password, this.userId).subscribe(
      message => this.message = message,
      error => this.error = <any>error);
  }
}
