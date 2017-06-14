import {Component, OnInit} from '@angular/core';

import {Request} from '../../entity/request'
import {RequestService} from "../../services/request.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {EmptyValidator} from "../../validator/empty.validator";
import {IValidator} from "../../validator/validator.interface";
import {TimeValidator} from "../../validator/time.validator";
import {NumberValidator} from "../../validator/number.validator";
import {DateValidator} from "../../validator/date.validator";
import {MapService} from "../../services/map.service";
import {NotifierService} from "../../services/notify.service";
import {REQUEST_LIST} from "../../app/app.routing.module";
import {IServiceForm} from "../layouts/service/serviceform.interface";

@Component({
  templateUrl: '../layouts/service/serviceform.component.html',
  styleUrls: ['../layouts/service/serviceform.component.css', '../layouts/forminput/forminput.component.css'],
  providers: [RequestService, UserService, MapService]
})
export class RequestComponent implements OnInit, IServiceForm {
  private static NAME : string = 'Request';
  registration = true;
  category = [];
  message: string;
  load:boolean = false;
  error: string = '';
  refresh: boolean = false;
  location: string = '';
  data = new Request(null, '', '', -1, 1, '', '', 0, '');
  loaderVisible: boolean = false;
  first:boolean = false;
  pictureLoadError:boolean = false;
  type: boolean = false;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  timeValidator: IValidator = new TimeValidator();
  numberValidator: IValidator = new NumberValidator();
  valid: boolean[] = [false, false, false, false, false, false, false];
  lastImage: string = '';

  constructor(private requestService: RequestService, private router: Router, private userService: UserService, private route: ActivatedRoute, private mapService: MapService, private notifier: NotifierService) {
    notifier.pageChanged$.subscribe(action => {
      if (action == RequestComponent.NAME) {
        router.navigate([REQUEST_LIST]);
      }
    });
    notifier.tryAgain$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
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
            this.type = true;
            this.requestService.getRequest(id).subscribe(
              data => {
                this.data = data;
                this.lastImage = this.data.image;
                this.location = JSON.parse(data.location).address;
              },
              error => {this.error = <any>error; this.notifier.notifyError(error.toString());}
            )
          }
        }
      });
  }

  public onClickSave() {
    if (this.checkValidation()) {
      this.requestService.saveRequest(this.data).subscribe(
        message => {
          this.notifier.pageChanged$.emit(' ');
          this.router.navigate([REQUEST_LIST]);
        },
        error => {
          this.error = <any>error;
          this.message = '';
        });
    } else {
      this.error = 'Incorrect or empty value';
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

  public getPictureUrl() {
    if (this.data.image == null || this.data.image.length == 0 || this.data.image === 'null') {
      return '';
    }
    return this.data.image;
  }

  public onClickBrowse(event) {
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

  public onClickCancel() {
    if (this.data.image.length > 0) {
      this.data.image = this.lastImage;
    }
  }

  public onSelectChange(event) {
    this.data.category = event;
  }

  public onClickSelectLocation() {
    this.load = !this.load;
  }

  public locationSelected(location) {
    let data: String = JSON.stringify(location);
    if((data.length < 10 && this.location.length > 0)){
      this.onClickSelectLocation();
    } else {
      this.data.location = data.replace(/"/g, '\"');
      this.location = location.address;
      this.onClickSelectLocation();
    }
  }

  public getDate(): string {
    if (this.data.expirydate > 0) {
      let date: Date = new Date(this.data.expirydate);
      return date.getFullYear() + '-' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '-' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
    }
    return '';
  }

  public onClickDelete() {
    this.requestService.deleteUserRequest(this.data.rid).subscribe(
      ok => {
        this.notifier.pageChanged$.emit(' ');
        this.router.navigate([REQUEST_LIST]);
      },
      error => {
        this.error = error
      }
    );
  }

  getTitle(): string {
    return (this.type ? 'Update' : 'New') + ' request';
  }

  fieldValidate(index: number, value: boolean) {
      if(index >= 0 && index < this.valid.length){
        this.valid[index] = value;
      }
  }

  showElements(): boolean {
    return false;
  }

  isUpdate(): boolean {
    return this.type;
  }
}
