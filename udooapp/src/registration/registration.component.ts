import {Component} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {ValidationComponent} from "../textinput/validation.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css'],
  providers: [UserService, ValidationComponent]
})
export class RegistrationComponent {
  message: String;
  error: string;
  registration = true;
  user = new User(null, '', '', '', '', '', 0, 0, '');
  passwordVerification: string;
  loaderVisible = false;
  first = false;
  pictureLoadError = false;

  constructor(private router : Router, private userService: UserService, private validation: ValidationComponent, private sanitizer: DomSanitizer) {
    this.passwordVerification = '';
  }

  getPictureUrl(): SafeResourceUrl {
    if (this.user.picture.length == 0 || this.user.picture === 'null') {
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
      }else {
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

  insertUser() {
    if (this.validation.checkValidation()) {
      if (this.user.password === this.passwordVerification) {
        this.userService.registrateUser(this.user)
          .subscribe(
            message => {
              console.log("Error" + message);
              this.router.navigate(['/login']);
              this.message = message},
            error => this.error = <any>error);

      } else {
        this.error = 'Invalid password';
      }
    }
  }
}
