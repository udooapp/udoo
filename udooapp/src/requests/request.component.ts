import {Component, OnInit} from '@angular/core';
import {RequestService} from "../entity/request.service";
import {Request} from "../entity/request";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService]
})
export class RequestComponent implements OnInit{
  data : Request[];
  offer = false;
  error : String;

  constructor(private requestService : RequestService ){}

  ngOnInit(){
    this.getReqests();
  }

  getReqests(){
    this.requestService.getUserRequest(1).subscribe(
      data => this.data = data,
      error =>  this.error = <any>error);
  }

}
