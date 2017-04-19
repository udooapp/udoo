import {Component, OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

import {User} from "../entity/user";
import {UserService} from "../services/user.service";


@Component({
  templateUrl: '../layouts/input.component.html',
  styleUrls: ['../layouts/input.component.css', './profile.component.css'],
  providers: [UserService]
})

export class ProfileComponent implements  OnInit {
  registration = false;
  message: String;
  error: string;
  user  = new User(null, '', '', '', '', '', 0, '');
  passwordCheck = '';
  public visible = [false, false, false, false, false, false];

  constructor(private userService: UserService) { }

  ngOnInit(){
    this.userService.getUser(2).subscribe(
      user => this.user = user,
      error =>  this.error = <any>error);
  }


  insertUser() {
    this.visible[0] = this.user.name.length == 0;
    this.visible[1] = this.user.email.length == 0;
    this.visible[2] = this.user.phone.length == 0;
    this.visible[3] = this.user.type === 1 && this.user.birthdate.length == 0;
    this.visible[4] = this.registration && this.user.password.length == 0;
    this.visible[5] = this.registration && document.getElementById("password-verification").nodeValue.length == 0;
    if(!this.visible[0] && !this.visible[1] && !this.visible[2] && !this.visible[3] && !this.visible[4] && !this.visible[5]) {
      this.userService.updateUser(this.user).subscribe(
        message => this.message = message,
        error => this.error = <any>error);
    }
  }


}
