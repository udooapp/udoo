import {Component} from '@angular/core';

@Component({
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent {
  registration = true;
  category = ['Select', 'Cleaning', 'Washing', 'Other'];
  message = '';
  offer = false;
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
