import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../entity/user";
import {IValidator} from "../../validator/validator.interface";
import {PasswordValidator} from "../../validator/password.validator";
import {PhoneValidator} from "../../validator/phone.validator";
import {DateValidator} from "../../validator/date.validator";
import {EmailValidator} from "../../validator/email.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NotifierController} from "../../controllers/notify.controller";
import {SafeResourceUrl} from "@angular/platform-browser";
import {IFormInput} from "../layouts/userform/forminput.interface";
import {DialogController} from "../../controllers/dialog.controller";
import {ROUTES} from "../../app/app.routing";


@Component({
  templateUrl: '../layouts/userform/forminput.component.html',
  styleUrls: ['../layouts/userform/forminput.component.css'],
  providers: [UserService]
})
export class RegistrationComponent implements OnInit, IFormInput {

  static NAME: string = 'Registration';
  message: String;
  error: string;
  refresh = false;
  registration = true;
  user: any = {uid: -1, name: '', email: '', phone: '', password: '', picture: '', type: 0, birthday: '', facebookid: 0, googleid: ''};
  passwordVerification: string;
  loaderVisible = false;
  first = false;
  facebookRegistration = false;
  pictureLoadError = false;
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  dateValidator: IValidator = new DateValidator();
  phoneValidator: IValidator = new PhoneValidator();
  passwordValidator: IValidator = new PasswordValidator();
  valid: boolean[] = [false, false, false, false, false, false];

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute, private notifier: NotifierController, private dialog: DialogController) {
    this.passwordVerification = '';
    this.notifier.notify(RegistrationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == RegistrationComponent.NAME) {
        router.navigate([ROUTES.LOGIN]);
      }
    })
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        if (params['facebook']) {
          let user: User = JSON.parse(localStorage.getItem("registration"));
          if (user != null) {
            localStorage.removeItem("registration");
            this.user = user;
            this.facebookRegistration = true;
          } else {
            this.notifier.back();
          }
        }
      });
  }

  disableEmailInput(): boolean {
    return this.facebookRegistration;
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
    if (index >= 0 && index < this.valid.length) {
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
            this.dialog.notifyError(error.toString());
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
        if (this.facebookRegistration) {
          this.userService.registrateFacebookUser(this.user)
            .subscribe(
              () => {
                this.notifier.pageChanged$.emit(' ');
                this.dialog.sendMessage('Registration completed!');
                this.router.navigate([ROUTES.MAIN]);
              },
              error => {
                this.error = error.toString() === 'Unauthorized' ? 'Email address is exist!' : <any>error;
                this.dialog.notifyError(error.toString());
              });
        } else {
          this.userService.registrateUser(this.user)
            .subscribe(
              ()=> {
                this.notifier.pageChanged$.emit(' ');
                this.router.navigate([ROUTES.LOGIN]);
              },
              error => {
                this.error = error.toString() === 'Unauthorized' ? 'Email address is exist!' : <any>error;
                this.dialog.notifyError(error.toString());
              });
        }
      } else {
        this.error = 'Different passwords';
      }
    } else {
      this.error = 'Invalid or empty value';
    }
  }
}
