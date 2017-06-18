import {Component, OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

import {User} from "../../entity/user";
import {UserService} from "../../services/user.service";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {EmailValidator} from "../../validator/email.validator";
import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";
import {DateValidator} from "../../validator/date.validator";
import {PhoneValidator} from "../../validator/phone.validator";
import {NotifierService} from "../../services/notify.service";
import {MAP} from "../../app/app.routing.module";
import {IFormInput} from "../layouts/forminput/forminput.interface";


@Component({
  templateUrl: '../layouts/forminput/forminput.component.html',
  styleUrls: ['../layouts/forminput/forminput.component.css'],
  providers: [UserService, TokenService]
})

export class ProfileComponent implements OnInit, IFormInput {
  private static NAME: string = 'Profile';
  registration = false;
  message: String;
  error: string;
  refresh: boolean = false;
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0);
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

  constructor(private userService: UserService, private notifier: NotifierService, private router: Router) {
    this.passwordVerification = '';
    notifier.pageChanged$.subscribe(action => {
      if (action == ProfileComponent.NAME) {
        router.navigate([MAP])
      }
    });
    notifier.tryAgain$.subscribe(tryAgain => {
      this.ngOnInit()
    })
    this.notifier.notify(ProfileComponent.NAME);
  }

  ngOnInit() {

    this.userService.getUserData().subscribe(
      data => {
        if (data.user.picture.length > 4) {
          this.first = false;
        }
        this.user = data.user;
        this.lastPicture = this.user.picture;
        this.error = '';
      },
      error => {
        this.message = '';
        this.error = 'Please try again later';
        this.notifier.notifyError(error.toString());
      });
  }

  public getPictureUrl() {
    if (this.user.picture == null || this.user.picture.length == 0 || this.user.picture === 'null') {
      return '';
    }
    return this.user.picture;
  }

  public onClickBrowse(event) {
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

  public onClickCancel() {
    if (this.user.picture.length > 0) {
      this.user.picture = this.lastPicture;
    }
  }

  public onKeyPassword(event: any) { // without type info
    this.passwordVerification = event;
    if (this.user.password.length > 5) {
      if (this.user.password !== event) {
        this.error = 'Invalid data';
      } else {
        this.error = '';
      }
    }
  }
  showElements(): boolean {
    return false;
  }
  fieldValidate(index: number, value: boolean) {
    if(index >= 0 && index < this.valid.length) {
      this.valid[index] = value;
    }
  }
  private checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        this.refresh = !this.refresh;
        return false;
      }
    }
    return true;
  }

  public onClickSave() {
    if (this.checkValidation()) {
      this.userService.updateUser(this.user).subscribe(
        message => {
          this.error = '';
          this.message = message;
          this.notifier.refreshMainData();
        },
        error => {
          this.message = '';
          this.error = error.toString().match('401') || error.toString() === 'Unauthorized' ? 'Email address is exist' : 'Please try again later';
        });
    } else {
      this.error = 'Invalid or empty value';
    }
  }

  getTitle(): string {
    return 'Profile';
  }
}
