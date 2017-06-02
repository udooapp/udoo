import {Component, OnInit} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Request} from "../entity/request";
import {Router} from "@angular/router";
import {MapService} from "../services/map.service";
import {NotifierService} from "../services/notify.service";
import {AppRoutingModule} from "../app/app.routing.module";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService, MapService]
})
export class RequestListComponent implements OnInit {
  data: Request[];
  offer = false;
  error: string;
  message: string = '';
  categories = [];

  constructor(private requestService: RequestService, private mapService: MapService, private router: Router, private notifier: NotifierService) {
    notifier.tryAgain$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.requestService.getUserRequest().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
    this.mapService.getCategories().subscribe(
      data => this.categories = data,
      error => {
        this.error = <any> error;
        this.notifier.notifyError(this.error);
      }
    );
  }

  public getAddress(location: string) {
    if (location == null || location === 'null' || location.length == 0) {
      return '';
    } else if (!location.match('address')) {
      return location;
    }
    return JSON.parse(location).address;
  }

  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  public isExpired(millis: number) {
    return millis == null || new Date() > new Date(millis);
  }

  public convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  public onClickDelete(id: number, index: number) {
    this.requestService.deleteUserRequest(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => this.error = <any>error
    );
  }

  public getCategory(cat: number) {
    for (let i = 0; i < this.categories.length; ++i) {
      if (cat == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }
}
