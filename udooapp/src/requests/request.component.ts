import {Component, OnInit} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Request} from "../entity/request";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService]
})
export class RequestComponent implements OnInit {
  data: Request[];
  offer = false;
  error: string;

  constructor(private requestService: RequestService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.requestService.getUserRequest().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }
  getAddress(location : string){
    return JSON.parse(location).address;
  }
  getPictureUrl(url : string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + url);
  }
}
