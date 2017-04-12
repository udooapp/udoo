import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {User} from "../user/user";
@Component({
  templateUrl: '../inputform/input.component.html',
  styleUrls: ['../inputform/input.component.css','./profile.component.css'],
})

export class ProfileComponent {
  registration = false;
  message = '';
  user = new User(null, '', '', '', '', '', true, '');
  passwordCheck = '';
  valid = false;
  public visible = [false, false];

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

  updateProfile() {
    this.message = 'Profile updated!';
  }
}
