import {Component} from '@angular/core';

@Component({
  templateUrl: '../inputform/offerrequest.component.html',
  styleUrls: ['../inputform/offerrequest.component.css'],
})
export class NewOfferComponent {
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
