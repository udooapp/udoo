import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [OfferService]
})
export class OfferComponent implements OnInit {
  data: Offer[];
  offer = true;
  error: string;

  constructor(private requestService: OfferService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.requestService.getUserOffer().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }
  getPictureUrl(url : string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + url);
  }
  getAddress(location: string) {
    return JSON.parse(location).address;
  }
}

