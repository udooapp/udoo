import {Component, OnInit} from '@angular/core';
import {Offer} from "../../entity/offer";
import {OfferService} from "../../services/offer.service";
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {NotifierController} from "../../controllers/notify.controller";
import {OFFER, OFFER_TYPE} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";

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

  constructor(private offerService: OfferService, private mapService: MapService, private router: Router, private notifier: NotifierController) {
    super();
    notifier.tryAgain$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.offerService.getUserOffer().subscribe(
      data => this.data = data,
      error => {
        this.error = <any>error;
        this.notifier.notifyError(error.toString());
      });
    this.mapService.getCategories().subscribe(
      data => this.categories = data,
      error => {
        this.error = <any>error;
          this.notifier.notifyError(error.toString());
      }
    );
  }

  public onClickDelete(id: number, index: number) {
    this.offerService.deleteUserOffer(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => {
        this.error = <any>error;
        this.notifier.notifyError(error.toString());
      }
    );
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

