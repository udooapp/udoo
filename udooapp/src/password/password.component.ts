import {Component} from '@angular/core';


import {User} from '../entity/user';
import {UserService} from "../entity/user.service";

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService]
})
export class PasswordComponent {
  message: String;
  user = new User(null, '', '', '', '', '', 0, '');
  error = '';
  password = '';

  constructor(private userService: UserService) {
  }

  save() {
    this.userService.changePassword(this.user.password, this.password, this.user.id).subscribe(
      message => this.message = message,
      error => this.error = <any>error);
  }
}
