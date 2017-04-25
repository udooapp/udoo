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
  loaderVisible = false;
  first = true;

  constructor(private userService: UserService, private validation: ValidationComponent, private sanitizer: DomSanitizer) {
    this.passwordVerification = '';
  }

  ngOnInit() {
    this.userService.getUser(2).subscribe(
      user => this.user = user,
      error => this.error = <any>error);
  }

  getUrl() {
    if (this.user.picture.length == 0 || this.user.picture === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + this.user.picture);
  }

  onChange(event) {
    if(!this.first) {
      this.loaderVisible = true;
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.userService.uploadPicture(fileList[0]).subscribe(
          message => {
            console.log('Message: ' + message);
            this.user.picture = message.toString();
            this.loaderVisible = false;
          },
          error => console.log('Error: ' + error)
        );
      }
    } else {
      this.first = false;
    }
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

  insertUser() {
    if (this.validation.checkValidation()) {
      this.userService.updateUser(this.user).subscribe(
        message => this.message = message,
        error => {
          this.error = <any>error;
          console.log(this.error);
        });
    } else {
      this.passwordCheck = 'Invalid password';
    }
  }
}
