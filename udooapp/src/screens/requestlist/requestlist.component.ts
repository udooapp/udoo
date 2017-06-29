import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {Request} from "../../entity/request";
import {MapService} from "../../services/map.service";
import {IList} from "../layouts/list/lists.interface";
import { REQUEST, REQUEST_TYPE} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";

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
  delete: boolean = false;
  index: number = 0;
  id: number = 0;
  constructor(private requestService: RequestService, private mapService: MapService, private dialog: DialogController) {
    super();
    dialog.errorResponse$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    dialog.questionResponse$.subscribe(response => {
      if(response && this.delete){
        this.requestService.deleteUserRequest(this.id, -1).subscribe(
          result => {
            this.message = result;
            this.data.splice(this.index, 1)
          },
          error => this.error = <any>error
        );
        this.delete = false;
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
        this.dialog.notifyError(this.error);
      }
    );
  }

  public onClickDelete(id: number, index: number) {
    this.delete = true;
    this.id = id;
    this.index = index;
    this.dialog.sendQuestion("Are you sure?");
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
  public getImage(index:number){
    if(index >= 0 && index < this.data.length && this.data[index].picturesRequest.length > 0){
      return this.data[index].picturesRequest[0].src;
    }
    return '';
  }
}
