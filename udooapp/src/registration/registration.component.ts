import {Component} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from "../services/user.service";
import {FormGroup} from "@angular/forms";
import {ValidationComponent} from "../input/validation.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  templateUrl: '../layouts/forminput.component.html',
  styleUrls: ['../layouts/forminput.component.css'],
  providers: [UserService, ValidationComponent]
})
export class RegistrationComponent {
  message: String;
  error: string;
  registration = true;
  user = new User(null, '', '', '', '', '', 0, '');
  passwordCheck = '';
  passwordVerification: string;
  pictureForm: FormGroup;

  constructor(private userService: UserService, private validation: ValidationComponent, private sanitizer: DomSanitizer) {
    this.passwordVerification = '';
  }
  getUrl() : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.user.picture);
  }
  onChange(event :any){
    this.user.picture = event.target.value;
  }

  onSubmit() {
    const formModel = this.pictureForm.value;
    const pictureSource: String = formModel.source;
    console.log("SRC: " + pictureSource);
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
      if (this.user.password === this.passwordVerification) {
        this.userService.registrateUser(this.user)
          .subscribe(
            message => this.message = message,
            error => this.error = <any>error);

      } else {
        this.passwordCheck = 'Invalid password';
      }
    }
  }
}
