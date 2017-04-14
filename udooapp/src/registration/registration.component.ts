import {Component} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from "../entity/user.service";

@Component({
  templateUrl: '../layouts/input.component.html',
  styleUrls: ['../layouts/input.component.css'],
  providers: [UserService]
})
export class RegistrationComponent {
  message: String;
  error: string;
  registration = true;
  user = new User(null, '', '', '', '', '', 0, '');
  passwordCheck = '';
  valid = false;
  public visible = [false, false];

  constructor(private userService: UserService) {
  }

  onKey(event: any) { // without type info
    if (this.user.password.length > 5) {
      if (this.user.password !== (<HTMLInputElement>event.target).value) {
        this.passwordCheck = 'Invalid password';
        this.valid = false;
      } else {
        this.passwordCheck = '';
        this.valid = true;
      }
    } else {
      this.valid = false;
    }
    this.visible[1] = (<HTMLInputElement>event.target).value.length === 0;
  }

  focusName(): void {
    this.visible[0] = this.user.name.length === 0;
  }

  newUser() {
    this.userService.registrateUser(this.user)
      .subscribe(
        message => this.message = message,
        error => this.error = <any>error);

    this.valid = true;
  }
}
