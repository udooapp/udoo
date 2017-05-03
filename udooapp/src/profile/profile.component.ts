import {Component, OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

import {User} from "../entity/user";
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../input/validation.component";
import {DomSanitizer} from "@angular/platform-browser";
import {TokenService} from "../guard/TokenService";


@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css'],
  providers: [UserService, ValidationComponent, TokenService]
})

export class ProfileComponent implements OnInit {
  registration = false;
  message: String;
  error: string;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  passwordVerification: string;
  loaderVisible = false;
  first = false;
  pictureLoadError = false;

  constructor(private userService: UserService, private validation: ValidationComponent, private sanitizer: DomSanitizer, private tokenService: TokenService) {
    this.passwordVerification = '';
  }

  ngOnInit() {
    this.userService.getUserData(this.tokenService.getToken()).subscribe(
      user => {
        if (user.picture.length > 4) {
          this.first = false;
        }
        this.user = user;
        this.error = '';
      },
      error => this.error = 'Please try again later');
  }

  getPictureUrl() {
    if (this.user.picture == null || this.user.picture.length == 0 || this.user.picture === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + this.user.picture);
  }

  onClickBrowse(event) {
    if (!this.first) {
      this.loaderVisible = true;
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.userService.uploadPicture(fileList[0]).subscribe(
          message => {
            console.log('Message: ' + message);
            this.user.picture = message.toString();
            this.loaderVisible = false;
            this.pictureLoadError = false;
          },
          error => {
            console.log('Error: ' + error);
            this.pictureLoadError = true;
          }
        );
      }
    } else {
      this.first = false;
    }
  }

  onClickCancel() {
    if (this.user.picture.length > 0) {
      this.user.picture = "";
    }
  }

  onKey(event: any) { // without type info
    this.passwordVerification = event;
    if (this.user.password.length > 5) {
      if (this.user.password !== event) {
        this.error = 'Invalid password';
      } else {
        this.error = '';
      }
    }
  }

  insertUser() {
    if (this.validation.checkValidation()) {
      this.userService.updateUser(this.user).subscribe(
        message => {
          this.error = '';
          this.message = message;
          this.tokenService.saveToken(JSON.parse(this.tokenService.getToken()).token, this.user.email);
        },
        error => {
          this.error = error.toString().match('401') ? 'Email address is exist' : 'Please try again later';
          console.log(this.error + ' ');
        });
    } else {
      this.error = 'Invalid password';
    }
  }
}
