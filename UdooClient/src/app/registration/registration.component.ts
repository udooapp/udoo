import {Component} from '@angular/core';
import {User} from '../user/user'
import {RegistrationService} from './registration.service'

@Component({
  selector: 'app-root',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [RegistrationService]
})
export class RegistrationComponent {
  message = "";
  user = new User(null, '', '', '', '', '');
  passwordCheck = "";
  valid = false;

  constructor(public registrationService: RegistrationService) {}

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
  }

  newUser() {
    this.registrationService.postUser(this.user);
    this.valid = true;
    this.message = 'Registration complete!';
  }
}
