import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {TokenService} from "../guard/TokenService";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService, TokenService]
})
export class OfferComponent implements OnInit {
  data: Offer[];
  offer = true;
  error: string;

  constructor(private requestService: OfferService, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.requestService.getUserOffer(this.tokenService.getToken()).subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }

  getAddress(location: string) {
    return JSON.parse(location).address;
  }
}

