import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService]
})
export class OfferComponent implements OnInit {
  data: Offer[];
  offer = true;
  error: string;

  constructor(private requestService: OfferService) {
  }

  ngOnInit() {
    this.requestService.getUserOffer(1).subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }
  getAddress(location : string){
    return JSON.parse(location).address;
  }
}

