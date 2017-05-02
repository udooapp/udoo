import {Component, OnInit} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Request} from "../entity/request";
import {TokenService} from "../guard/TokenService";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService, TokenService]
})
export class RequestComponent implements OnInit {
  data: Request[];
  offer = false;
  error: string;

  constructor(private requestService: RequestService, private tokenServie : TokenService) {
  }

  ngOnInit() {
    this.requestService.getUserRequest(this.tokenServie.getToken()).subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }
  getAddress(location : string){
    return JSON.parse(location).address;
  }
}
