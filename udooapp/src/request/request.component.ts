import {Component, OnInit} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {EmptyValidator} from "../validator/empty.validator";
import {IValidator} from "../validator/validator.interface";
import {TimeValidator} from "../validator/time.validator";
import {NumberValidator} from "../validator/number.validator";
import {DateValidator} from "../validator/date.validator";
import {MapService} from "../services/map.service";
import {NotifierService} from "../services/notify.service";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css', '../layouts/forminput.component.css'],
  providers: [RequestService, UserService, MapService]
})
export class RequestComponent implements OnInit {
  private static NAME : string = 'Request';
  registration = true;
  category = [];
  message: String;
  offer = false;
  load = false;
  error = '';
  refresh: boolean = false;
  location = '';
  data = new Request(null, '', '', -1, 1, '', '', 0, '');
  loaderVisible = false;
  first = false;
  pictureLoadError = false;
  type: number = -1;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  timeValidator: IValidator = new TimeValidator();
  numberValidator: IValidator = new NumberValidator();
  valid: boolean[] = [false, false, false, false, false, false, false];
  lastImage: string = '';

  constructor(private requestService: RequestService, private router: Router, private userService: UserService, private route: ActivatedRoute, private mapService: MapService, private notifier: NotifierService) {
    notifier.pageChanged$.subscribe(action => {
      if (action == RequestComponent.NAME) {
        router.navigate(['/requestlist']);
      }
    });
    this.notifier.notify(RequestComponent.NAME);
  }

  ngOnInit() {
    this.data.category = this.category[0];
    this.mapService.getCategories().subscribe(
      data => {
        this.category = data;
        this.category.splice(0, 0, {cid: -1, name: 'Select category'})
      },
      error => this.error = <any>error
    );
    let id: number = -1;
    this.route.params
      .subscribe((params: Params) => {
        if (params['id'] != null && params['type'] != null && !isNaN(params['id']) && !isNaN(params['type'])) {
          id = +params['id'];
          if (id != null) {
            this.type = +params['type'];
            this.requestService.getRequest(id).subscribe(
              data => {
                this.data = data;
                this.lastImage = this.data.image;
                this.location = JSON.parse(data.location).address;
              },
              error => this.error = <any>error
            )
          }
        }
      });
  }

  save() {
    if (this.checkValidation()) {
      this.requestService.saveRequest(this.data).subscribe(
        message => {
          this.router.navigate(['/requestlist']);
        },
        error => {
          console.log(<any>error);
          this.error = <any>error;
          this.message = '';
        });
    } else {
      this.error = 'Incorrect or empty value';
    }
  }

  checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        this.refresh = !this.refresh;
        return false;
      }
    }
    return true;
  }

  getPictureUrl() {
    if (this.data.image == null || this.data.image.length == 0 || this.data.image === 'null') {
      return '';
    }
    return this.data.image;
  }

  onClickBrowse(event) {
    if (!this.first) {
      this.loaderVisible = true;
      let fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.userService.uploadPicture(fileList[0]).subscribe(
          message => {
            this.data.image = message.toString();
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

  onClickCancel() {
    if (this.data.image.length > 0) {
      this.data.image = this.lastImage;
    }
  }

  onChangeSelect(event) {
    this.data.category = event;
  }

  onClickSelectLocation() {
    this.load = !this.load;
  }

  saveLocation(location) {
    let data: String = JSON.stringify(location);
    if((data.length < 10 && this.location.length > 0)){
      this.onClickSelectLocation();;
    } else {
      this.data.location = data.replace(/"/g, '\"');
      this.location = location.address;
      this.onClickSelectLocation();
    }
  }

  getDate(): string {
    if (this.data.expirydate > 0) {
      let date: Date = new Date(this.data.expirydate);
      return date.getFullYear() + '-' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '-' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
    }
    return '';
  }

  deleteService() {
    this.requestService.deleteUserRequest(this.data.rid).subscribe(
      ok => {
        this.router.navigate(['/requestlist']);
      },
      error => {
        this.error = error
      }
    );
  }
}
