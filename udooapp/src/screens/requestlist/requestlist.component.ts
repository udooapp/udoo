import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {Request} from "../../entity/request";
import {MapService} from "../../services/map.service";
import {NotifierController} from "../../controllers/notify.controller";
import {IList} from "../layouts/list/lists.interface";
import { REQUEST, REQUEST_TYPE} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";

@Component({
  templateUrl: '../layouts/list/lists.component.html',
  styleUrls: ['../layouts/list/lists.component.css'],
  providers: [RequestService, MapService]
})
export class RequestListComponent extends ConversionMethods implements OnInit, IList {
  data: Request[];
  offer = false;
  error: string;
  message: string = '';
  categories = [];

  constructor(private requestService: RequestService, private mapService: MapService, private notifier: NotifierController) {
    super();
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

  public getButtonRouteText(): string {
    return REQUEST;
  }

  public getTitle(): string {
    return 'My service requests'
  }

  public getButtonText(): string {
    return 'Add new request';
  }

  public getServiceRouteText(index: number): string {
    if (index >= 0 && index < this.data.length) {
      return REQUEST_TYPE + this.data[index].rid + '/1';
    }
    return '';
  }
}
