import {Component} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {ValidationComponent} from "../input/validation.component";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [OfferService, ValidationComponent, MapService]
})
export class NewOfferComponent {
  registration = true;
  category = [];
  message: String;
  error = '';
  offer = true;
  load = false;
  data = new Offer(null, '', '', 0, 1, '', '', 0);

  constructor(private offerService: OfferService, private validation : ValidationComponent, private mapService : MapService) {
    this.mapService.getCategories().subscribe(
      data => {
        this.category = data;
        this.category.splice(0, 0, {cid: 0, name: 'Select category'})
      },
      error => this.error = <any>error
    );
  }

  save() {
    if(this.validation.checkValidation() && this.data.category > 0) {
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

  onSelect() {
    this.load = !this.load;
  }

  saveLocation(location: Object) {
    this.data.location = JSON.stringify(location).replace('"', '\\"');
    this.onSelect();
  }
}
