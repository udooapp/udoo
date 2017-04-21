import {Component} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {FormGroup} from "@angular/forms";

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
  public visible = [false, false, false, false, false, false];
  pictureForm: FormGroup;

  constructor(private userService: UserService) {
  }

  onSubmit() {
    const formModel = this.pictureForm.value;
    const pictureSource: String = formModel.source;
    console.log("SRC: " + pictureSource);
  }


  onKey(event: any) { // without type info
    if (this.user.password.length > 5) {
      if (this.user.password !== event) {
        this.passwordCheck = 'Invalid password';
      } else {
        this.passwordCheck = '';
      }
    } else {
    }
    this.visible[1] = (<HTMLInputElement>event.target).value.length === 0;
  }

  insertUser() {
    this.visible[0] = this.user.name.length == 0;
    this.visible[1] = this.user.email.length == 0;
    this.visible[2] = this.user.phone.length == 0;
    this.visible[3] = this.user.type === 1 && this.user.birthdate.length == 0;
    this.visible[4] = this.registration && this.user.password.length == 0;
   // this.visible[5] = document.getElementById("password-verification").nodeValue.length == 0;
    if(!this.visible[0] && !this.visible[1] && !this.visible[2] && !this.visible[3] && !this.visible[4] && !this.visible[5]) {
      this.userService.registrateUser(this.user)
        .subscribe(
          message => this.message = message,
          error => this.error = <any>error);
    }
  }
}
