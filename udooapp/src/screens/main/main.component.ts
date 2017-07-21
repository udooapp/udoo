import {AfterViewChecked, Component, OnInit} from '@angular/core';
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
export class MainComponent extends ConversionMethods implements OnInit, MainSearchListener, AfterViewChecked {
  public page: number = 1;
  public margin: number = 0;
  public tabAnimation = '';
  public type = 0;
  private scriptLoadingPromise: Promise<void>;
  public categories: any[] = [{cid: -1, name: ''}];
  private error: string;
  private category: number = -1;
  private searchString = '';
  public mapData: any = {requestsWindow: [], offersWindow: [], mapInit: false, id: 0};
  public listData: any = {services: [], offerSize: 0, requestSize: 0, more: true};
  public searchListener: MainSearchListener = this;
  public result: any[];
  private width: number = 0;

  constructor(private mapService: MapService, private dialog: DialogController, private tokenService: TokenService, private mapController: MapMainController, private listController: ListMainController) {
    super();
    let t = this;
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });

    window.addEventListener("orientationchange", function () {
      let el = document.getElementById("tab-pager");
      if (el != null) {
        t.width = el.clientWidth / 3;
      }
    });
    window.addEventListener("resize", function () {
      let el = document.getElementById("tab-pager");
      if (el != null) {
        t.width = el.clientWidth / 3;
        t.margin = t.page * t.width;
      }
    });
  }

  ngAfterViewChecked(): void {
    let el = document.getElementById("tab-pager");
    if (el != null) {
      this.width = el.clientWidth / 3;
    }
    let t = this;
    let el2 = document.getElementById("main-tab-selected");
    if (el2 != null) {
      el2.addEventListener('animationend', function (e) {
        e.preventDefault();
        t.tabAnimation = '';
        t.margin = t.width * t.page;
      }, false);
    }
  }

  initMap() {
    this.load().then(() => {
      this.mapData.mapInit = true;
      this.mapController.setData$.emit(true);
    }).catch((error) => {
      console.log("ERROR: " + error.toString());
    });
  }

  ngOnInit() {
    this.initMap();
    let data = this.tokenService.getSearchData();
    this.searchString = data.text == null || data.text.length == 0 ? '' : data.text;
    this.type = data.type == null ? 0 : data.type;
    this.category = data.category == null ? -1 : data.category;
    this.page = this.tokenService.getPageState();
    this.width = window.innerWidth / 3;
    this.margin = this.page * this.width;
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
        if (this.page == 0) {
          ++this.mapData.id;
          this.mapController.setData$.emit(this.mapData);
        } else if (this.page == 1) {
          this.listController.setData$.emit(this.listData);
        }

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
    if (pageIndex >= 0 && pageIndex < 3 && this.page != pageIndex) {
      this.page = pageIndex;
      this.tokenService.setPageState(pageIndex);
      this.tabAnimation = 'tabPage' + pageIndex;
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

  private load(): Promise<void> {
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    const callbackName = 'initMap';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCvn27CPRnDIm_ROE-Q8U-x2pUYep7yCmU&callback=' + callbackName;

    this.scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (<any>window)[callbackName] = () => {
        resolve();
      };

      script.onerror = (error: Event) => {
        reject(error);
      };
    });

    document.body.appendChild(script);

    return this.scriptLoadingPromise;
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
    switch (page) {
      case 0:
        ++this.mapData.id;
        this.mapController.setData$.emit(this.mapData);
        break;
      case 1:
        this.listController.setData$.emit(this.listData);
        break;
      case 2:
        break;
    }
  }

  public getMargin(index: number) {
    let width = this.width * 3;
    let margin = 0;
    switch (index) {
      case 0:
        margin = -(this.page * width);
        break;
      case 1:
        margin = ((1 - this.page) * width);
        break;
      case 2:
        margin = ((2 - this.page) * width);
        break;
    }
    return margin;
  }
}
