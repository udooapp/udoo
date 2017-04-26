import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService, MapService]
})
export class OfferComponent implements OnInit {
  data: Offer[];
  offer = true;
  error: string;
  categories: any[] = [];

  constructor(private requestService: OfferService, private mapService: MapService) {
  }

  ngOnInit() {
    this.mapService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.categories.splice(0, 0, {cid: 0, name: 'Select category'})
      },
      error => this.error = <any>error
    );
    this.requestService.getUserOffer(1).subscribe(
      data => this.data = data,
      error => this.error = <any>error);

  }

  getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' +  category + ' id is not exist!';
  }
}

