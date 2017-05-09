import {Component, OnInit} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EmptyValidator} from "../validator/empty.validator";
import {IValidator} from "../validator/validator.interface";
import {TimeValidator} from "../validator/time.validator";
import {NumberValidator} from "../validator/number.validator";
import {DateValidator} from "../validator/date.validator";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css', '../layouts/forminput.component.css'],
  providers: [RequestService, UserService, MapService]
})
export class RequestComponent implements OnInit {
  registration = true;
  category = [];
  message: String;
  offer = false;
  load = false;
  error = '';
  location = '';
  data = new Request(null, '', '', -1, 1, '', '', '', '');
  loaderVisible = false;
  first = false;
  pictureLoadError = false;
  type: number = -1;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  timeValidator: IValidator = new TimeValidator();
  numberValidator: IValidator = new NumberValidator();
  valid: boolean[] = [false, false, false, false, false, false, false];

  constructor(private requestService: RequestService, private router: Router, private userService: UserService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private mapService: MapService) {
    this.data.category = this.category[0];
    this.mapService.getCategories().subscribe(
      data => {
        this.category= data;
        this.category.splice(0, 0, {cid: -1, name: 'Select category'})
      },
      error => this.error = <any>error
    );
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
    } else {
      this.error = 'Incorrect or empty value';
    }
  }

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
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
    this.data.location = JSON.stringify(location).replace(/"/g, '\\"');
    this.location = location.address;
    this.onClickSelectLocation();
  }

  deleteService(){
    this.requestService.deleteUserRequest(this.data.rid).subscribe(
      ok=>{
        this.router.navigate(['/requestlist'])
      },
      error =>{this.error = error}
    );
  }
}
