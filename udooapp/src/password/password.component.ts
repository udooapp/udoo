import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../user/user';

@Component({
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  message = '';
  user = new User(null, '', '', '', '', '', false, '');
  error = '';



  save() {this.message = 'Password saved!'}
}
