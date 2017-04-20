import {Component} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../services/request.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [RequestService]
})
export class NewRequestComponent {
  registration = true;
  category = ['Select', 'Cleaning', 'Washing', 'Other'];
  message: String;
  offer = false;
  load = false;
  valid = false;
  error = '';
  data = new Request(null, '', '', '', 1, '', '', '', '');
  public visible = [false, false];


  constructor(private requestService: RequestService, private router: Router) {
  }

  onKey(event: any) { // without type info
  }


  save() {
    this.valid = true;
    this.requestService.saveRequest(this.data).subscribe(
      message => this.message = message,
      error => {
        this.error = '';
        console.error(<any>error)
      });
    this.message = 'Offer saved';
    this.error = '';
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
