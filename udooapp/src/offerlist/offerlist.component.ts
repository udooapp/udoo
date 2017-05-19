import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {Router} from "@angular/router";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService, MapService]
})
export class OfferListComponent implements OnInit {
  data: Offer[];
  offer = true;
  error: string;
  message: string = '';
  categories = [];

  constructor(private offerService: OfferService, private mapService: MapService, private router: Router) {
  }

  ngOnInit() {
    this.offerService.getUserOffer().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
    this.mapService.getCategories().subscribe(
      data => this.categories = data,
      error => this.error = <any>error
    );
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  isExpired(millis: number) {
    return millis == null || new Date() > new Date(millis);
  }

  getAddress(location: string) {
    if (location == null || location === 'null' || location.length == 0) {
      return '';
    } else if(!location.match('address')){
      return location;
    }
    return JSON.parse(location).address;
  }

  convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  onClickDelete(id: number, index: number) {
    this.offerService.deleteUserOffer(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => this.error = <any>error
    );
  }

  getCategory(cat: number) {
    for (let i = 0; i < this.categories.length; ++i) {
      if (cat == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }

  onClickEdit(id: number) {
    this.router.navigate(['offer/' + id + '/' + 0]);
  }
}

