import {Component} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../entity/offer.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [OfferService]
})
export class NewOfferComponent {
  registration = true;
  category = ['Select', 'Cleaning', 'Washing', 'Other'];
  message : String;
  error = '';
  offer = true;
  load = false;
  valid = false;
  data = new Offer(null, '', '', '', 1, '', '', '');
  public visible = [false, false];

  constructor(private offerService: OfferService, private router: Router,) {
  }

  onKey(event: any) { // without type info
  }

  save() {
    this.valid = true;
    this.offerService.saveOffer(this.data).subscribe(
      message => this.message = message,
      error => this.error = <any>error);
    this.message = 'Offer saved';
    this.valid = true;
    this.message = 'Offer saved';
  }

  onSelect() {
    this.router.navigate(['/location', true]);
  }
}
