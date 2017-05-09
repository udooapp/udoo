import {Component, OnInit} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Request} from "../entity/request";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService]
})
export class RequestListComponent implements OnInit {
  data: Request[];
  offer = false;
  error: string;
  message: string = '';

  constructor(private requestService: RequestService, private sanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit() {
    this.requestService.getUserRequest().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }

  getAddress(location: string) {
    return JSON.parse(location).address;
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + url);
  }

  isExpired(millis: number) {
    return millis == null || new Date() > new Date(millis);
  }

  convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  onClickDelete(id: number, index: number) {
    console.log("Deleted:" + id);
    this.requestService.deleteUserRequest(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => this.error = <any>error
    );
  }

  onClickEdit(id: number) {
    this.router.navigate(['request/' + id + '/' + 1])
  }
}
