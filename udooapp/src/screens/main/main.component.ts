import {Component, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {TokenService} from "../../services/token.service";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";
import {MainSearchListener} from "./main.search.listener";
import {MapMainController} from "./map/map.main.controller";
import {ListMainController} from "./list/list.main.controller";


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MapService]
})
export class MainComponent extends ConversionMethods implements OnInit, MainSearchListener {
  public page: number = 1;

  public type = 0;
  public categories: any[] = [{cid: -1, name: ''}];
  private error: string;
  private category: number = -1;
  private searchString = '';
  public mapData: any = {requestsWindow: [], offersWindow: []};
  public listData: any = {services: [], offerSize: 0, requestSize: 0, more: true};
  public searchListener: MainSearchListener = this;
  public result: any[];

  constructor(private mapService: MapService, private dialog: DialogController, private tokenService: TokenService, private mapController: MapMainController, private listController: ListMainController) {
    super();
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    let data = this.tokenService.getSearchData();
    this.searchString = data.text == null || data.text.length == 0 ? '' : data.text;
    this.type = data.type == null ? 0 : data.type;
    this.category = data.category == null ? -1 : data.category;
    this.page = this.tokenService.getPageState();
    this.error = '';
    this.mapService.getCategories().subscribe(
      data => {
        data.splice(0, 0, {cid: "-1", name: 'Select category'});
        this.categories = data;
      },
      error => {
        this.error = <any>error;
        this.checkError();
      }
    );
    this.loadAvailableServices();
  }

  public loadAvailableServices() {
    console.log('GetData');
    this.mapService.getAvailableServices(this.category, this.searchString, this.type).subscribe(
      result => {
        this.listData = {services: [], offerSize: 0, requestSize: 0, more: true};
        if (result.request) {

          this.mapData.requestsWindow = result.requestLite;
          this.listData.services = result.request;
          this.listData.requestSize = result.request.length;
        } else {
          this.mapData.requestsWindow = [];
        }
        if (result.offer) {
          this.listData.offerSize = result.offer.length;
          this.mapData.offersWindow = result.offerLite;
          for (let i = 0; i < result.offer.length; ++i) {
            this.listData.services.push(result.offer[i]);
          }
        } else {
          this.mapData.offersWindow = [];
        }
        this.mapController.setData$.emit(this.mapData);
        this.listController.setData$.emit(this.listData);
      },
      error => {
        this.error = error;
        this.checkError();
      }
    );
  }

  private checkError() {
    this.dialog.notifyError(this.error);
  }

  public onClickPage(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < 3) {
      this.page = pageIndex;
      this.tokenService.setPageState(pageIndex);
    }
  }

  onTypeChangeId(index) {
    if (index != this.type) {
      this.type = index;
      this.loadAvailableServices();
    }
  }

  onKey(value) {
    this.searchString = value.target.value;
    if (value.which === 13) {
      this.loadAvailableServices();
    } else {
      this.searchString = value.target.value;
      if (this.searchString.length > 0) {
        this.mapService.getAvailableResults(this.searchString, this.type).subscribe(
          result => {
            this.result = [];
            for (let i = 0; i < result.length; ++i) {
              this.result.push({
                category: this.findCatName(result[i].id),
                result: result[i].result,
                id: result[i].id
              })
            }
          },
          error => console.log(error)
        );
      }
    }
  }

  onCategoryChange(id) {
    if (id != this.category) {
      this.category = id;
      this.loadAvailableServices();
    }
  }

  public findCatName(catID: number): string {
    for (let i = 0; i < this.categories.length; ++i) {
      if (catID == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }

  loadMoreElement() {
    this.mapService.getMoreAvailableServices(this.category, this.searchString, this.type, this.listData.offerSize, this.listData.requestSize).subscribe(
      result => {
        let more = 0;
        if (this.listData.requestSize > -1 && result.requests) {
          let rlength: number = result.requests.length;
          for (let i = 0; i < rlength; ++i) {
            this.listData.services.push(result.requests[i]);
          }
          if (rlength >= 5) {
            this.listData.requestSize += rlength;
          } else {
            this.listData.requestSize = -1;
            ++more;
          }
        } else {
          ++more;
        }
        if (this.listData.offerSize > -1 && result.offers) {
          let olength: number = result.offers.length;
          for (let i = 0; i < olength; ++i) {
            this.listData.services.push(result.offers[i]);
          }
          if (olength >= 5) {
            this.listData.offerSize += olength;
          } else {
            this.listData.offerSize = -1;
            ++more;
          }
        } else {
          ++more;
        }
        this.listData.more = more < 2;
        this.listController.setData$.emit(this.listData);
      },
      error => {
        this.dialog.notifyError(error);
      }
    );
  }

  onClickResultDropdown(index) {
    if (this.categories != index) {
      this.category = index;
      this.loadAvailableServices();
    }
  }

  getSearchData(): any {
    return {text: this.searchString, type: this.type, category: this.category};
  }

  getData(page: number) {
    switch (page){
      case 0:
        this.mapController.setData$.emit(this.mapData);
        break;
      case 1:
        this.listController.setData$.emit(this.listData);
        break;
      case 2:
    }
  }
}
