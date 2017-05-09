import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {IValidator} from "../validator/validator.interface";
import {EmptyValidator} from "../validator/empty.validator";
import {DateValidator} from "../validator/date.validator";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css', '../layouts/forminput.component.css'],
  providers: [OfferService, UserService]
})
export class OfferComponent implements OnInit {
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
  type: number = -1;
  pictureLoadError = false;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  valid: boolean[] = [false, false, false, false, false, false];

  constructor(private offerService: OfferService, private router: Router, private userService: UserService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    this.data.category = this.category[0];
  }

  ngOnInit() {
    let id: number = -1;
    this.route.params
      .subscribe((params: Params) => {
        if (params['id'] != null && params['type'] != null && !isNaN(params['id']) && !isNaN(params['type'])) {
          id = +params['id'];
          if (id != null) {
            this.type = +params['type'];
            console.log("" + id);
          }
        }
      });
  }

  save() {
    if (this.checkValidation()) {
      this.offerService.saveOffer(this.data).subscribe(
        message => {
          this.router.navigate(['/request'])
        },
        error => {
          this.error = <any>error;
          this.message = ''
        });
    } else {
      this.error = 'Incorrect or empty value';
    }
  }

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        console.log(i);
        return false;
      }
    }
    return true;
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
    this.location = location.address;
    this.data.location = JSON.stringify(location).replace(/"/g, '\\"');
    this.onClickSelectLocation();
  }

  deleteService(){
    this.offerService.deleteUserOffer(this.data.oid).subscribe(
      ok=>{
        this.router.navigate(['/offerlist'])
      },
      error =>{this.error = error}
    );
  }
}
