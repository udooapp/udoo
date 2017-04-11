import {Component} from '@angular/core';
import {User} from '../user/user';
import {RegistrationService} from './registration.service';

@Component({
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [RegistrationService]
})
export class RegistrationComponent {
  message = '';
  user = new User(null, '', '', '', '', '', false, '');
  passwordCheck = '';
  valid = false;
  public visible = [false, false];

  constructor(public registrationService: RegistrationService) {
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
    this.registrationService.postUser(this.user);
    this.valid = true;
    this.message = 'Registration complete!';
  }
}
