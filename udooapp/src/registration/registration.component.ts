import {Component} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {PhoneValidator} from "../validator/phone.validator";
import {IValidator} from "../validator/validator.interface";
import {DateValidator} from "../validator/date.validator";
import {EmailValidator} from "../validator/email.validator";
import {EmptyValidator} from "../validator/empty.validator";
import {PasswordValidator} from "../validator/password.validator";
import {NotifierService} from "../services/notify.service";
import {Location} from "@angular/common";

@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css'],
  providers: [UserService]
})
export class RegistrationComponent {
  message: String;
  error: string;
  refresh = false;
  registration = true;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  passwordVerification: string;
  loaderVisible = false;
  first = false;
  pictureLoadError = false;
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  dateValidator: IValidator = new DateValidator();
  phoneValidator: IValidator = new PhoneValidator();
  passwordValidator: IValidator = new PasswordValidator();
  valid: boolean[] = [false, false, false, false, false, false];

  constructor(private router: Router, private userService: UserService, private notifier: NotifierService) {
    this.passwordVerification = '';
    notifier.notify('Registration');
    notifier.pageChanged$.subscribe(action => {
      if (action == '') {
        router.navigate(['/login']);
      }
    })
  }

  getPictureUrl(): SafeResourceUrl {
    if (this.user.picture.length == 0 || this.user.picture === 'null') {
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
      } else {
        this.loaderVisible = false;
      }
    } else {
      this.first = false;
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

  onClickCancel() {
    if (this.user.picture.length > 0) {
      this.user.picture = '';
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
      if (this.user.password === this.passwordVerification) {
        this.userService.registrateUser(this.user)
          .subscribe(
            message => {
              this.router.navigate(['/login']);
              this.message = message
            },
            error => this.error = <any>error);

      } else {
        this.error = 'Invalid password';
      }
    } else {
      this.error = 'Invalid or empty value';
    }
  }
}
