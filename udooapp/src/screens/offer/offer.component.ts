import {Component, OnInit} from '@angular/core';
import {Offer} from "../../entity/offer";
import {OfferService} from "../../services/offer.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";
import {DateValidator} from "../../validator/date.validator";
import {MapService} from "../../services/map.service";
import {NotifierService} from "../../services/notify.service";
import { OFFER_LIST} from "../../app/app.routing.module";
import {IServiceForm} from "../layouts/service/serviceform.interface";

@Component({
  templateUrl: '../layouts/service/serviceform.component.html',
  styleUrls: ['../layouts/service/serviceform.component.css', '../layouts/forminput/forminput.component.css'],
  providers: [OfferService, UserService, MapService]
})
export class OfferComponent implements OnInit, IServiceForm {
  private static NAME: string = 'Offer';
  registration = true;
  category = [];
  message: String;
  error: string = '';
  refresh: boolean = false;
  location: string = '';
  load:boolean = false;
  data = new Offer(null, '', '', -1, 1, '', '', 0, '', false);
  loaderVisible:boolean = false;
  first:boolean = false;
  type:boolean = false;
  pictureLoadError = false;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  valid: boolean[] = [false, false, false, false, false, false];
  lastImage: string = '';

  constructor(private offerService: OfferService, private router: Router, private userService: UserService, private route: ActivatedRoute, private mapService: MapService, private notifier: NotifierService) {
    notifier.pageChanged$.subscribe(action => {
      if (action == OfferComponent.NAME) {
        console.log("Action:" + action);
        router.navigate([OFFER_LIST]);
      }
    });
    this.notifier.notify(OfferComponent.NAME);
    notifier.tryAgain$.subscribe(tryAgain => {
      this.ngOnInit();
    });
  }

  ngOnInit() {

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
            this.offerService.getOffer(id).subscribe(
              data => {
                this.data = data;
                this.lastImage = this.data.image;
                this.location = JSON.parse(data.location).address;
              },
              error => {
                this.error = <any>error;
                this.notifier.notifyError(this.error)
              }
            )
          }
        }
      });
  }

  public  onClickSave() {
    if (this.checkValidation()) {
      this.offerService.saveOffer(this.data).subscribe(
        message => {
          this.notifier.pageChanged$.emit(' ');
          this.router.navigate([OFFER_LIST]);
        },
        error => {
          this.error = <any>error;
          this.message = ''
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

  showElements(): boolean {
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

  public onClickDelete() {
    this.offerService.deleteUserOffer(this.data.oid).subscribe(
      ok => {
        this.notifier.pageChanged$.emit(' ');
        this.router.navigate([OFFER_LIST])
      },
      error => {
        this.error = error
      }
    );
  }

  getTitle(): string {
    return (this.type ? 'Update' : 'New') + ' offer';
  }

  fieldValidate(index: number, value: boolean) {
    if(index >= 0 && index < this.valid.length){
      this.valid[index] = value;
    }
  }

  isUpdate(): boolean {
    return this.type;
  }
}
