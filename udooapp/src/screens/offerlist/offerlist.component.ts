import {Component, OnInit} from '@angular/core';
import {OfferService} from "../../services/offer.service";
import {MapService} from "../../services/map.service";
import {OFFER, OFFER_TYPE} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {MainComponent} from "../main/main.component";

@Component({
  templateUrl: '../layouts/list/lists.component.html',
  styleUrls: ['../layouts/list/lists.component.css'],
  providers: [OfferService, MapService]
})
export class OfferListComponent extends ConversionMethods implements OnInit {
  data: any[];
  offer = true;
  error: string;
  message: string = '';
  categories = [];
  delete: boolean = false;
  index: number = 0;
  id: number = 0;
  loading: boolean = false;
  noMore = false;

  constructor(private offerService: OfferService, private mapService: MapService, private dialog: DialogController, private notifier: NotifierController) {
    super();
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.userScrollDown();
    });
    dialog.questionResponse$.subscribe(response => {
      if (response && this.delete) {
        this.offerService.deleteUserOffer(this.id, -1).subscribe(
          result => {
            this.message = result;
            this.data.splice(this.index, 1)
          },
          error => this.error = <any>error
        );
        this.delete = false;
      }
    });
  }

  ngOnInit() {
    this.loading = true;
    this.offerService.getUserOffers(0, -1).subscribe(
      data => {
        this.data = data;
        if (data.length < MainComponent.PAGE_SIZE) {
          this.noMore = true;
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.error = <any>error;
        this.dialog.notifyError(error.toString());
      });
    this.mapService.getCategories().subscribe(
      data => this.categories = data,
      error => {
        this.error = <any>error;
        this.dialog.notifyError(error.toString());
      }
    );
  }

  private userScrollDown() {
    if (!this.loading && !this.noMore) {
      this.loading = true;
      let length = this.data.length;
      let lastId = length > 0 ? this.data[length - 1].oid : -1;
      this.offerService.getUserOffers(length, lastId).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
            if (data.length < MainComponent.PAGE_SIZE) {
              this.noMore = true;
            }
          }
          this.loading = false;
        },
        error => {
          this.error = <any>error;
          this.loading = false;
        });
    }
  }

  public onClickDelete(id: number, index: number) {
    this.id = id;
    this.index = index;
    this.delete = true;
    this.dialog.sendQuestion("Are you sure?");
  }

  public getCategory(cat: number) {
    for (let i = 0; i < this.categories.length; ++i) {
      if (cat == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }


  public getButtonRouteText(): string {
    return OFFER;
  }

  public getTitle(): string {
    return 'My service offers'
  }

  public getButtonText(): string {
    return 'Add new offer';
  }

  public getServiceRouteText(index: number): string {
    if (index >= 0 && index < this.data.length) {
      return OFFER_TYPE + this.data[index].oid + '/0';
    }
    return '';
  }

  public getImage(index: number) {
    if (index >= 0 && index < this.data.length && this.data[index].picturesOffer.length > 0) {
      return this.data[index].picturesOffer[0].src;
    }
    return '';
  }
}

