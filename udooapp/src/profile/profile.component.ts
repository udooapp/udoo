import {Component, OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

import {User} from "../entity/user";
import {UserService} from "../services/user.service";
import {TokenService} from "../guard/TokenService";
import {Router} from "@angular/router";
import {EmailValidator} from "../validator/email.validator";
import {IValidator} from "../validator/validator.interface";
import {EmptyValidator} from "../validator/empty.validator";
import {DateValidator} from "../validator/date.validator";
import {PhoneValidator} from "../validator/phone.validator";


@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css'],
  providers: [UserService, TokenService]
})

export class ProfileComponent implements OnInit {
  registration = false;
  message: String;
  error: string;
  refresh: boolean = false;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  passwordVerification: string;
  loaderVisible = false;
  first = false;
  pictureLoadError = false;
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  dateValidator: IValidator = new DateValidator();
  phoneValidator: IValidator = new PhoneValidator();
  valid = [false, false, false];
  lastPicture: string = '';

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router) {
    this.passwordVerification = '';
  }

  ngOnInit() {
    this.userService.getUserData().subscribe(
      user => {
        if (user.picture.length > 4) {
          this.first = false;
        }
        this.user = user;
        this.lastPicture = this.user.picture;
        this.error = '';
      },
      error => this.error = 'Please try again later');
  }

  getPictureUrl() {
    if (this.user.picture == null || this.user.picture.length == 0 || this.user.picture === 'null') {
      return '';
    }
    return this.user.picture;
  }

  onClickBrowse(event) {
    if (!this.first) {
      this.loaderVisible = true;
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.userService.uploadPicture(fileList[0]).subscribe(
          message => {
            this.user.picture = message.toString();
            this.loaderVisible = false;
            this.pictureLoadError = false;
          },
          error => {
            this.pictureLoadError = true;
            this.loaderVisible = false;
          }
        );
      }
    } else {
      this.first = false;
    }
  }

  onClickCancel() {
    if (this.user.picture.length > 0) {
      this.user.picture = this.lastPicture;
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

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        this.refresh = !this.refresh;
        return false;
      }
    }
    return true;
  }

  insertUser() {
    if (this.checkValidation()) {
      this.userService.updateUser(this.user).subscribe(
        message => {
          this.error = '';
          this.message = message;
          this.tokenService.setRefresh(true);
        },
        error => {
          this.error = error.toString().match('401') ? 'Email address is exist' : 'Please try again later';
        });
    } else {
      this.error = 'Invalid or empty value';
    }
  }
}
