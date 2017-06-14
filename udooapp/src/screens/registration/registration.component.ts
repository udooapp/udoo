import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../entity/user";
import {IValidator} from "../../validator/validator.interface";
import {PasswordValidator} from "../../validator/password.validator";
import {PhoneValidator} from "../../validator/phone.validator";
import {DateValidator} from "../../validator/date.validator";
import {EmailValidator} from "../../validator/email.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {Router} from "@angular/router";
import {NotifierService} from "../../services/notify.service";
import {LOGIN} from "../../app/app.routing.module";
import {SafeResourceUrl} from "@angular/platform-browser";
import {IFormInput} from "../layouts/forminput/forminput.interface";


@Component({
  templateUrl: '../layouts/forminput/forminput.component.html',
  styleUrls: ['../layouts/forminput/forminput.component.css'],
  providers: [UserService]
})
export class RegistrationComponent implements IFormInput {

  static NAME: string = 'Registration';
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
    notifier.notify(RegistrationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == RegistrationComponent.NAME) {
        router.navigate([LOGIN]);
      }
    })
  }

  public getPictureUrl(): SafeResourceUrl {
    if (this.user.picture.length == 0 || this.user.picture === 'null') {
      return '';
    }
    return this.user.picture;
  }
  public getTitle(): string {
    return 'Registration';
  }

  showElements(): boolean {
    return true;
  }

  fieldValidate(index: number, value: boolean) {
    if(index >= 0 && index < this.valid.length) {
      this.valid[index] = value;
    }
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
            this.notifier.notifyError(error.toString());
          }
        );
      } else {
        this.loaderVisible = false;
      }
    } else {
      this.first = false;
    }
  }

  public onKeyPassword(event: any) { // without type info
    this.passwordVerification = event;
  }

  public onClickCancel() {
    if (this.user.picture.length > 0) {
      this.user.picture = '';
    }
  }

  private checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.user.type && i != 3) {
        if (!this.valid[i]) {
          this.refresh = !this.refresh;
          return false;
        }
      } else if (this.user.type) {
        if (!this.valid[i]) {
          this.refresh = !this.refresh;
          return false;
        }
      }
    }
    return true;
  }

  public onClickSave() {
    if (this.checkValidation()) {
      if (this.user.password === this.passwordVerification) {
        this.userService.registrateUser(this.user)
          .subscribe(
            message => {
              this.notifier.pageChanged$.emit(' ');
              this.router.navigate([LOGIN]);
            },
            error => {
              this.error = error.toString() === 'Unauthorized' ? 'Email address is exist!' : <any>error;
              this.notifier.notifyError(error.toString());
            });

      } else {
        this.error = 'Different passwords';
      }
    } else {
      this.error = 'Invalid or empty value';
    }
  }
}
