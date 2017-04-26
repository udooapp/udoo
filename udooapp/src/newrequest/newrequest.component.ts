import {Component} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {ValidationComponent} from "../input/validation.component";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [RequestService, ValidationComponent, MapService]
})
export class NewRequestComponent {
  registration = true;
  category = [];
  message: String;
  offer = false;
  load = false;
  error = '';
  data = new Request(null, '', '', 0, 1, '', '', '', '');


  constructor(private requestService: RequestService, private  validation : ValidationComponent, private mapService :MapService) {
    this.mapService.getCategories().subscribe(
      data => {
        this.category= data;
        this.category.splice(0, 0, {cid: 0, name: 'Select category'})
      },
      error => this.error = <any>error
    );
  }

  save() {
    if(this.validation.checkValidation() && this.data.category > 0) {
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

  onSelect() {
    this.load = !this.load;
  }

  saveLocation(location: Object) {
    this.data.location = JSON.stringify(location).replace('"', '\\"');
    this.onSelect();
  }
}
