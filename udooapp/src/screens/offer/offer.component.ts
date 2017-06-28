import {Component, OnInit} from '@angular/core';
import {Offer} from "../../entity/offer";
import {OfferService} from "../../services/offer.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";
import {DateValidator} from "../../validator/date.validator";
import {MapService} from "../../services/map.service";
import {NotifierController} from "../../controllers/notify.controller";
import {OFFER_LIST} from "../../app/app.routing.module";
import {IServiceForm} from "../layouts/service/serviceform.interface";
import {DialogController} from "../../controllers/dialog.controller";
import {ScrollableGalleryComponent} from "../../components/gallery/gallery.component";

@Component({
  templateUrl: '../layouts/service/serviceform.component.html',
  styleUrls: ['../layouts/service/serviceform.component.css', '../layouts/forminput/forminput.component.css'],
  providers: [OfferService, MapService]
})
export class OfferComponent implements OnInit, IServiceForm {
  private static NAME: string = 'Offer';
  registration = true;
  category = [];
  message: String;
  error: string = '';
  refresh: boolean = false;
  location: string = '';
  load: boolean = false;

  data = new Offer(null, '', '', -1, 1, '', '', 0, '', false, []);
  type: boolean = false;
  emptyValidator: IValidator = new EmptyValidator();
  dateValidator: IValidator = new DateValidator();
  valid: boolean[] = [false, false, false, false, false, false];

  //Gallery
  insertedId = -1;
  imageLoading: number[] = [];
  imageError: number[] = [];
  serviceDelete: boolean = false;
  clickedImage = 0;

  constructor(private offerService: OfferService, private router: Router,private route: ActivatedRoute, private mapService: MapService, private notifier: NotifierController, private dialog: DialogController) {
    this.notifier.notify(OfferComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == OfferComponent.NAME) {
        if (this.insertedId == -1) {
          router.navigate([OFFER_LIST]);
        } else {
          this.dialog.sendQuestion('Unsaved data will be lost! Do you want to go back?');
          this.notifier.notify(OfferComponent.NAME);
        }
      } else if (action == ScrollableGalleryComponent.IMAGE) {
        ++this.clickedImage;
      }
    });
    dialog.errorResponse$.subscribe(tryAgain => {
      this.ngOnInit();
    });
    this.dialog.questionResponse$.subscribe(response => {
       if (response) { //Clicked --> Yes
        if (this.serviceDelete) {     //onClickServiceDelete

          this.offerService.deleteUserOffer(this.data.oid, this.insertedId).subscribe(
            ok => {
              this.notifier.pageChanged$.emit(' ');
              this.router.navigate([OFFER_LIST]);
            },
            error => {
              this.error = error;
              this.dialog.notifyError(error);
            }
          );
          this.serviceDelete = false;
        } else if (this.insertedId > -1) {
          //if the user inserted a new picture and navigate back without saving/updating
          this.offerService.deleteUserOffer(this.data.oid, -1).subscribe(
            message => {
              this.insertedId = -1;
              this.notifier.back();
              router.navigate([OFFER_LIST]);
            },
            error => {
              //  this.dialog.notifyError(error);
            }
          );
        }
      } else {  //on clikc dilaog --> NO
        this.notifier.notify(OfferComponent.NAME);
      }
    });
  }

  ngOnInit() {
    this.insertedId = -1;
    this.serviceDelete = false;
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
                this.location = JSON.parse(data.location).address;
              },
              error => {
                this.error = <any>error;
                this.dialog.notifyError(this.error)
              }
            )
          }
        }
      });
  }

  public  onClickSave() {
    if (this.imageLoading.length == 0) {
      if (this.checkValidation()) {
        this.offerService.saveOffer(this.data, this.insertedId).subscribe(
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

  public onClickDeleteService() {
    this.serviceDelete = true;
    this.dialog.sendQuestion("Are you sure?");
  }

  getTitle(): string {
    return (this.type ? 'Update' : 'New') + ' offer';
  }

  fieldValidate(index: number, value: boolean) {
    if (index >= 0 && index < this.valid.length) {
      this.valid[index] = value;
    }
  }

  isUpdate(): boolean {
    return this.type;
  }

  onClickNewImage(event) {
    let first: boolean = false;
    if (this.insertedId == -1) {
      first = true;
      this.insertedId = this.data.oid;
      this.data.oid = null;
    }
    let input = event.target;
    let data = this.data;
    let imageLoading = this.imageLoading;
    let imageError = this.imageError;
    let reader = new FileReader();
    let offerService = this.offerService;
    reader.onload = function () {
      let dataURL = reader.result;
      let pos: number = data.picturesOffer.push({src: dataURL}) - 1;
      let pos2: number = imageLoading.push(pos) - 1;
      if (first) {
        offerService.createOffer(dataURL).subscribe(
          message => {

            data.oid = JSON.parse(message).delete;
            data.picturesOffer[data.picturesOffer.length - 1] = {src: dataURL, poid: JSON.parse(message).id};
            imageLoading.splice(pos2, 1);
          },
          error => {
            imageLoading.splice(pos2, 1);
            imageError.push(pos)
          }
        );
      } else {
        offerService.uploadPicture(data.oid, dataURL).subscribe(
          message => {
            data.picturesOffer[data.picturesOffer.length - 1] = {src: dataURL, poid: message};
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
    this.notifier.notify(ScrollableGalleryComponent.IMAGE);
  }

  onClickRemove(index: number) {
    if (index > -1 && index < this.data.picturesOffer.length) { //onClickPictureDelete (trash button)

      this.data.picturesOffer.splice(index, 1);
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
      index = -1;

    }
  }

  getPictures(): any[] {
    return this.data.picturesOffer;
  }
}
