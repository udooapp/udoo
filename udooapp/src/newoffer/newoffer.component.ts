import {Component} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {ValidationComponent} from "../input/validation.component";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [OfferService, ValidationComponent]
})
export class NewOfferComponent {
  registration = true;
  category = ['Cleaning', 'Washing', 'Other'];
  message: String;
  error = '';
  offer = true;
  load = false;
  data = new Offer(null, '', '', '', 1, '', '', 0);

  constructor(private offerService: OfferService, private validation : ValidationComponent) {
    this.data.category = this.category[0];
  }

  save() {
    if(this.validation.checkValidation()) {
      this.offerService.saveOffer(this.data).subscribe(
        message => this.message = message,
        error => this.error = <any>error);
      this.error = '';
      this.message = 'Offer saved';
    }
  }

  onChangeSelect(event) {
    this.data.category = event.target.value;
  }

  onClickSelectLocation() {
    this.load = !this.load;
  }

  saveLocation(location: Object) {
    this.data.location = JSON.stringify(location).replace('"', '\\"');
    this.onClickSelectLocation();
  }
}
