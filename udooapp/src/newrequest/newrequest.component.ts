import {Component} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {ValidationComponent} from "../input/validation.component";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [RequestService, ValidationComponent]
})
export class NewRequestComponent {
  registration = true;
  category = ['Cleaning', 'Washing', 'Other'];
  message: String;
  offer = false;
  load = false;
  error = '';
  data = new Request(null, '', '', '', 1, '', '', '', '');


  constructor(private requestService: RequestService, private  validation: ValidationComponent) {
    this.data.category = this.category[0];
  }

  save() {
    if (this.validation.checkValidation()) {
      this.requestService.saveRequest(this.data).subscribe(
        message => this.message = message,
        error => {
          this.error = '';
          console.error(<any>error)
        });
      this.message = 'Offer saved';
      this.error = '';
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
