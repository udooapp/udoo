import {Component} from '@angular/core';

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
})
export class OfferComponent {
  registration = true;
  category = ['Select', 'Cleaning', 'Washing', 'Other'];
  message = '';
  offer = true;
  passwordCheck = '';
  valid = false;
  public visible = [false, false];

  onKey(event: any) { // without type info
  }

  newOffer() {
    this.valid = true;
    this.message = 'Offer saved';
  }
}
