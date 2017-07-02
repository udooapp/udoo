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
import {NotifierController} from "../../controllers/notify.controller";
import {REQUEST_LIST} from "../../app/app.routing.module";
import {IServiceForm} from "../layouts/service/serviceform.interface";
import {DialogController} from "../../controllers/dialog.controller";
import {GalleryComponent} from "../../components/gallery/gallery.component";

@Component({
  templateUrl: '../layouts/service/serviceform.component.html',
  styleUrls: ['../layouts/service/serviceform.component.css', '../layouts/forminput/forminput.component.css'],
  providers: [RequestService, MapService]
})
export class RequestComponent implements OnInit, IServiceForm {
  private static NAME: string = 'Request';
  registration = true;
  category = [];
  message: string;
  load: boolean = false;
  error: string = '';
  refresh: boolean = false;
  location: string = '';
  data = new Request(null, '', '', -1, -1, '', '', 0, []);
  type: boolean = false;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  timeValidator: IValidator = new TimeValidator();
  numberValidator: IValidator = new NumberValidator();
  valid: boolean[] = [false, false, false, false, false, false, false];

  //Gallery

  modification: number[] = [-1, 0, -1];
  imageError: number[] = [];
  imageLoading: number[] = [];

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute, private mapService: MapService, private notifier: NotifierController, private dialog: DialogController) {
    this.notifier.notify(RequestComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == RequestComponent.NAME) {
        if (this.modification[0] <= 0) {
          this.modification[0] = -1;
          this.modification[1] = 0;
          this.modification[2] = -1;
          router.navigate([REQUEST_LIST]);
        } else {
          this.dialog.sendQuestion('Unsaved data will be lost! Do you want to go back?');
          this.notifier.notify(RequestComponent.NAME);
        }
      } else if (action == GalleryComponent.IMAGE) {
        ++this.modification[2];
      }
    });
    dialog.errorResponse$.subscribe(tryAgain => {
      this.ngOnInit();
    });
    this.dialog.questionResponse$.subscribe(response => {
      if (response) { //Clicked --> Yes
        if (this.modification[1] === 1) {     //onClickmodification[1]

          this.requestService.deleteUserRequest(this.data.rid, this.modification[0]).subscribe(
            ok => {
              this.modification[0] = -1;
              this.modification[1] = 0;
              this.modification[2] = -1;
              this.notifier.back();
              this.notifier.pageChanged$.emit(' ');
            },
            error => {
              this.error = error;
              this.dialog.notifyError(error);
            }
          );
          this.modification[1] = 0;
        } else if (this.modification[0] > -1) {
          //if the user inserted a new picture and navigate back without saving/updating
          this.requestService.deleteUserRequest(this.data.rid, -1).subscribe(
            message => {
              this.modification[0] = -1;
              this.modification[1] = 0;
              this.modification[2] = -1;
              this.notifier.back();
              this.notifier.pageChanged$.emit(' ');
            },
            error => {
              //  this.dialog.notifyError(error);
            }
          );
        }
      } else {  //on clikc dilaog --> NO
        //this.notifier.notify(RequestComponent.NAME);
      }
    });
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
                this.location = JSON.parse(data.location).address;
              },
              error => {
                this.error = <any>error;
                this.dialog.notifyError(error.toString());
              }
            )
          }
        }
      });
  }

  public onClickSave() {
    if (this.imageLoading.length == 0) {
      if (this.checkValidation()) {

        this.requestService.saveRequest(this.data, this.modification[0]).subscribe(
          message => {
            this.modification[0] = -1;
            this.modification[1] = 0;
            this.modification[2] = -1;
            this.data = new Request(null, '', '', -1, -1, '', '', 0, []);
            this.notifier.pageChanged$.emit(' ');
            this.notifier.back();
            this.router.navigate([REQUEST_LIST]);
          },
          error => {
            this.error = <any>error;
            this.message = '';
          });
      } else {
        this.error = 'Incorrect or empty value';
      }
    } else {
      this.dialog.sendMessage("Please, wait until the end of the image uploading!")
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

  public onSelectChange(event) {
    this.data.category = event;
  }

  public onClickSelectLocation() {
    this.load = !this.load;
  }

  public locationSelected(location) {
    let data: String = JSON.stringify(location);
    if ((data.length < 10 && this.location.length > 0)) {
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

  public onClickDeleteService() {
    this.modification[1] = 1;
    this.dialog.sendQuestion("Are you sure?");
  }

  getTitle(): string {
    return (this.type ? 'Update' : 'New') + ' request';
  }

  fieldValidate(index: number, value: boolean) {
    if (index >= 0 && index < this.valid.length) {
      this.valid[index] = value;
    }
  }

  showElements(): boolean {
    return false;
  }

  isUpdate(): boolean {
    return this.type;
  }

  onClickNewImage(event) {
    let first: boolean = false;
    if (this.modification[0] <= 0) {
      first = true;
      this.modification[0] = this.data.rid;
      this.data.rid = null;
    }
    let input = event.target;
    let data = this.data;
    let imageLoading = this.imageLoading;
    let imageError = this.imageError;
    let reader = new FileReader();
    let offerService = this.requestService;
    reader.onload = function () {
      let dataURL = reader.result;
      let pos: number = data.picturesRequest.push({src: dataURL}) - 1;
      let pos2: number = imageLoading.push(pos) - 1;
      if (first) {
        offerService.createRequest(dataURL).subscribe(
          message => {

            data.rid = JSON.parse(message).delete;
            data.picturesRequest[data.picturesRequest.length - 1] = {src: dataURL, prid: JSON.parse(message).id};
            imageLoading.splice(pos2, 1);
          },
          error => {
            imageLoading.splice(pos2, 1);
            imageError.push(pos)
          }
        );
      } else {
        offerService.uploadPicture(data.rid, dataURL).subscribe(
          message => {
            data.picturesRequest[data.picturesRequest.length - 1] = {src: dataURL, prid: message};
            imageLoading.splice(pos2, 1);
          },
          error => {
            imageLoading.splice(pos2, 1);
            imageError.push(pos)
          }
        );
      }
    };

    reader.readAsDataURL(input.files[0]);

  }

  onClickImage(index: number) {
    this.notifier.notify(GalleryComponent.IMAGE);
  }

  onClickRemove(index: number) {
    if (index > -1 && index < this.data.picturesRequest.length) { //onClickPictureDelete (trash button)

      this.data.picturesRequest.splice(index, 1);
      let i = 0;
      for (i; i < this.imageError.length; ++i) {
        if (this.imageError[i] == index) {
          break;
        }
      }
      this.imageError.splice(i, 1);
      i = 0;
      for (i; i < this.imageLoading.length; ++i) {
        if (this.imageLoading[i] == index) {
          break;
        }
      }
      this.imageLoading.splice(i, 1);
    }
  }

  getPictures(): any[] {
    return this.data.picturesRequest;
  }
}
