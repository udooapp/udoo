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
import {NotifierController} from "../../controllers/notify.controller";
import {MAP} from "../../app/app.routing.module";
import {IFormInput} from "../layouts/userform/forminput.interface";
import {DialogController} from "../../controllers/dialog.controller";


@Component({
  templateUrl: '../layouts/userform/forminput.component.html',
  styleUrls: ['../layouts/userform/forminput.component.css'],
  providers: [UserService, TokenService]
})

export class ProfileComponent implements OnInit, IFormInput {
  private static NAME: string = 'Profile';
  registration = false;
  message: String;
  error: string;
  refresh: boolean = false;
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
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

  constructor(private userService: UserService, private notifier: NotifierController, private router: Router,  private dialog: DialogController) {
    this.passwordVerification = '';


    dialog.errorResponse$.subscribe(() => {
      this.ngOnInit()
    });
    this.notifier.notify(ProfileComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == ProfileComponent.NAME) {
        router.navigate([MAP])
      }
    });
  }

  ngOnInit() {
    this.notifier.userDataPipe$.subscribe(user => {
      this.user = user;
      if (user.picture.length > 4) {
        this.first = false;
      }
      this.user = user;
      this.lastPicture = this.user.picture;
      this.error = '';
    });
    this.notifier.sendUserModification(NotifierController.REFRESH_USER_DATA);
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
          () => {
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

  disableEmailInput(): boolean {
    return false;
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
