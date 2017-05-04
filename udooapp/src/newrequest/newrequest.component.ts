import {Component} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {ValidationComponent} from "../textinput/validation.component";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EmptyValidator} from "../validator/empty.validator";
import {IValidator} from "../validator/validator.interface";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css', '../layouts/forminput.component.css'],
  providers: [RequestService, ValidationComponent, UserService]
})
export class NewRequestComponent {
  registration = true;
  category = ['Cleaning', 'Washing', 'Other'];
  message: String;
  offer = false;
  load = false;
  error = '';
  location = '';
  data = new Request(null, '', '', '', 1, '', '', '', '');
  loaderVisible = false;
  first = false;
  pictureLoadError = false;
  emptyValidator : IValidator = new EmptyValidator();

  constructor(private requestService: RequestService, private  validation: ValidationComponent, private router: Router, private userService: UserService, private sanitizer: DomSanitizer) {
    this.data.category = this.category[0];
  }

  save() {
    if (this.validation.checkValidation()) {
      console.log("Save");
      this.requestService.saveRequest(this.data).subscribe(
        message => {
          this.router.navigate(['/request'])
        },
        error => {
          this.error = 'ERROR';
          this.message = '';
          console.error(<any>error)
        });
    }
  }

  getPictureUrl() {
    if (this.data.image == null || this.data.image.length == 0 || this.data.image === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + this.data.image);
  }

  onClickBrowse(event) {
    if (!this.first) {
      this.loaderVisible = true;
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.userService.uploadPicture(fileList[0]).subscribe(
          message => {
            console.log('Message: ' + message);
            this.data.image = message.toString();
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
    if (this.data.image.length > 0) {
      this.data.image = "";
    }
  }

  onChangeSelect(event) {
    this.data.category = event;
  }

  onClickSelectLocation() {
    this.load = !this.load;
  }

  saveLocation(location) {
    this.data.location = JSON.stringify(location).replace(/"/g, '\\"');
    this.location = location.address;
    this.onClickSelectLocation();
  }
}
