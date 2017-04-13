import {Component} from '@angular/core';

import {Request} from '../entity/request'
import {RequestService} from "../entity/request.service";

@Component({
  templateUrl: '../layouts/offerrequest.component.html',
  styleUrls: ['../layouts/offerrequest.component.css'],
  providers: [RequestService]
})
export class NewRequestComponent {
  registration = true;
  category = ['Select', 'Cleaning', 'Washing', 'Other'];
  message : String;
  offer = false;
  passwordCheck = '';
  valid = false;
  error = '';
  data = new Request(null, '', '', '', 1, '', '', '');
  public visible = [false, false];

  constructor(private requestService: RequestService){}

  onKey(event: any) { // without type info
  }

  save() {
    this.valid = true;
    this.requestService.saveRequest(this.data).subscribe(
      message => this.message = message,
      error => this.error = <any>error);
    this.message = 'Offer saved';
  }
}
