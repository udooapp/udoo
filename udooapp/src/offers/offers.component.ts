import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../entity/offer.service";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService]
})
export class OfferComponent implements OnInit{
  data : Offer[];
  offer = true;
  error: string;
  constructor(private requestService : OfferService ){}

  ngOnInit(){
    this.getRequests();
  }

  getRequests(){
    this.requestService.getUserOffer(1).subscribe(
      data => this.data = data,
      error =>  this.error = <any>error);
  }
}
