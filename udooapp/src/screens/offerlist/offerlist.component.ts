import {Component, OnInit} from '@angular/core';
import {Offer} from "../../entity/offer";
import {OfferService} from "../../services/offer.service";
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {NotifierController} from "../../controllers/notify.controller";
import {OFFER, OFFER_TYPE} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";

@Component({
  templateUrl: '../layouts/list/lists.component.html',
  styleUrls: ['../layouts/list/lists.component.css'],
  providers: [OfferService, MapService]
})
export class OfferListComponent extends ConversionMethods implements OnInit {
  data: Offer[];
  offer = true;
  error: string;
  message: string = '';
  categories = [];
  delete: boolean = false;
  index: number = 0;
  id: number = 0;

  constructor(private offerService: OfferService, private mapService: MapService, private router: Router, private dialog: DialogController) {
    super();
    dialog.errorResponse$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    dialog.questionResponse$.subscribe(response => {
      if(response && this.delete){
        this.offerService.deleteUserOffer(this.id).subscribe(
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
    this.offerService.getUserOffer().subscribe(
      data => this.data = data,
      error => {
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
}

