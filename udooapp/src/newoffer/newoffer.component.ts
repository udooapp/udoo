import {Component} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {ValidationComponent} from "../input/validation.component";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css', '../layouts/forminput.component.css'],
  providers: [OfferService, ValidationComponent, UserService]
})
export class NewOfferComponent {
  registration = true;
  category = ['Cleaning', 'Washing', 'Other'];
  message: String;
  error = '';
  offer = true;
  location = '';
  load = false;
  data = new Offer(null, '', '', '', 1, '', '', '', '');
  loaderVisible = false;
  first = false;
  pictureLoadError = false;

  constructor(private offerService: OfferService, private validation: ValidationComponent, private router: Router, private userService: UserService, private sanitizer: DomSanitizer) {
    this.data.category = this.category[0];
  }

  save() {
    if (this.validation.checkValidation()) {
      this.offerService.saveOffer(this.data).subscribe(
        message => {
          this.router.navigate(['/request'])
        },
        error => {
          this.error = <any>error;
          this.message = ''
        });
    }
  }

  getPictureUrl() {
    if ( this.data.image == null || this.data.image.length == 0 || this.data.image === 'null') {
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
    this.data.category = event.target.value;
  }

  onClickSelectLocation() {
    this.load = !this.load;
  }

  saveLocation(location) {
    this.location = location.address;
    this.data.location = JSON.stringify(location).replace(/"/g, '\\"');
    this.onClickSelectLocation();
  }
}
