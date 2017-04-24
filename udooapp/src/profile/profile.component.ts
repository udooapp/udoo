import {Component, OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

import {User} from "../entity/user";
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../input/validation.component";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css', './profile.component.css'],
  providers: [UserService, ValidationComponent]
})

export class ProfileComponent implements OnInit {
  registration = false;
  message: String;
  error: string;
  user = new User(null, '', '', '', '', '', 0, '');
  passwordCheck = '';
  passwordVerification: string;

  constructor(private userService: UserService, private validation: ValidationComponent, private sanitizer: DomSanitizer) {
    this.passwordVerification = '';
  }

  ngOnInit() {
    this.userService.getUser(2).subscribe(
      user => this.user = user,
      error => this.error = <any>error);
  }
  getUrl() : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.user.picture);
  }

  onChange(event :any){
    this.user.picture = event.target.value;
  }

  onKey(event: any) { // without type info
    this.passwordVerification = event;
    if (this.user.password.length > 5) {
      if (this.user.password !== event) {
        this.passwordCheck = 'Invalid password';
      } else {
        this.passwordCheck = '';
      }
    }
  }

  onSubmit() {
    console.log("SRC: " + this.user.picture);
  }

  insertUser() {
    if (this.validation.checkValidation()) {
      if (this.passwordVerification === this.user.password) {
        this.userService.updateUser(this.user).subscribe(
          message => this.message = message,
          error => this.error = <any>error);
      } else {
        this.passwordCheck = 'Invalid password';
      }
    }
  }
}
