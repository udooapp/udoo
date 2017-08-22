import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {TokenService} from "../../services/token.service";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";
import {MainSearchListener} from "./main.search.listener";
import {MapMainController} from "./map/map.main.controller";
import {ListMainController} from "./list/list.main.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {SearchController} from "../../controllers/search.controller";
import {MenuController} from "../../controllers/menu.controller";
import {DETAIL} from "../../app/app.routing.module";
import {Router} from "@angular/router";
import {ServiceDialogController} from "../../components/service/service.window.controller";
import {OfferService} from "../../services/offer.service";
import {RequestService} from "../../services/request.service";
import {BidService} from "../../services/bid.service";


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MapService, OfferService, RequestService, BidService]
})
export class MainComponent extends ConversionMethods implements OnInit, OnDestroy, AfterViewChecked, MainSearchListener {
  private PAGE_ANIM: string = 'page';
  private TAB_ANIM: string = 'tabPage';
  public static PAGE_SIZE: number = 15;

  public page: number = 1;
  public margin: number = 0;

  private scriptLoadingPromise: Promise<void>;
  private error: string;

  //Search Data
  private category: number = -1;
  private searchString = '';

  //Page data
  public mapData: any = {requestsWindow: [], offersWindow: [], mapInit: false};
  public listData: any = {services: [], offerSize: 0, requestSize: 0, more: true};

  public searchListener: MainSearchListener = this;

  public result: any[];
  public pageMargin: number = 0;
  public pageContainerHeight: number = 0;
  public width: number = 0;
  private el: any;
  private el2: any;
  private startTouchX: number = 0;
  private moveTouchX: number = 0;
  private pageAnim0: string = '';
  private pageAnim1: string = '';
  private pageAnim2: string = '';
  public tabAnimation = '';

  public pagerMargin: number = 0;
  public searchVisibility: boolean = false;
  private swipeEnabled: boolean = true;

  //ServiceDialog
  private elementCoordinates: any = {lat: 0, lng: 0, dist: 0};
  public blur: boolean = false;

  //BidDialog
  public showBid: boolean = false;
  bid: any = {price: 0, description: '', sid: 0, type: false};

  //ScrollUp button
  public scrollUpVisibility: boolean = false;

  constructor(private bidService: BidService, private offerService: OfferService, private requestService: RequestService, private serviceDialogController: ServiceDialogController, private router: Router, private searchController: SearchController, private notifier: NotifierController, private mapService: MapService, private dialog: DialogController, private tokenService: TokenService, private mapController: MapMainController, private listController: ListMainController, private menuController: MenuController) {
    super();
    searchController.onClickSearchButton$.subscribe(() => {
      this.searchVisibility = true;
    });
    searchController.onClickSearchResult$.subscribe(searchText => {
      this.searchString = searchText;
      this.category = -1;
      this.loadAvailableServices();
    });
    this.searchController.onClickCategoryResult$.subscribe(category => {
      this.category = category.id;
      this.searchString = category.searchResult;
      this.loadAvailableServices();
    });
    this.searchController.onKeySearchText$.subscribe(searchText => {
      if (this.searchString != searchText || searchText.which == 13) {
        this.category = -1;
        this.searchString = searchText.target.value;
        if (searchText.which == 13) {
          this.loadAvailableServices();
        } else {
          if (this.searchString.length > 0) {
            this.mapService.getAvailableResults(this.searchString).subscribe(
              data => {
                this.searchController.searchResult$.emit(data);
              },
              error => {
                this.dialog.notifyError(error);
              }
            );
          } else {
            this.searchController.searchResult$.emit(null);
          }
        }
      }
    });

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
        switch (t.page) {
          case 0:
            t.pageMargin = 3 * t.width;
            break;
          case 1:
            t.pageMargin = 0;
            break;
          case 2:
            t.pageMargin = -3 * t.width;
        }
        t.pageContainerHeight = document.getElementById('content-container').offsetHeight - 45;
      }
    });

    window.addEventListener("resize", function () {
      let el = document.getElementById("tab-pager");
      if (el != null) {
        t.width = el.clientWidth / 3;
        t.margin = t.page * t.width;
        switch (t.page) {
          case 0:
            t.pageMargin = 3 * t.width;
            break;
          case 1:
            t.pageMargin = 0;
            break;
          case 2:
            t.pageMargin = -3 * t.width;
        }
        t.pageContainerHeight = document.getElementById('content-container').offsetHeight - 45;
      }
    });
    this.pageContainerHeight = document.getElementById('content-container').offsetHeight - 45;
    let contentContainer = document.getElementById('app-system-notification-container');
    if (contentContainer) {
      contentContainer.addEventListener('DOMSubtreeModified', function () {
        if (contentContainer) {
          t.pageContainerHeight = window.innerHeight - contentContainer.offsetHeight - 110;
        } else {
          t.pageContainerHeight = window.innerHeight - 110;
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    let t = this;

    if (this.el2 == null) {
      this.el2 = document.getElementById("tab-pager");
      if (this.el2 != null) {
        this.width = this.el2.clientWidth / 3;
      }
      this.el2.addEventListener('transitionend', function (e) {
        e.preventDefault();
        if (t.pagerMargin != 0 && t.pagerMargin != 50) {
          if (t.pagerMargin > 25) {
            t.pagerMargin = 50;
          } else {
            t.pagerMargin = 0;
          }
        }
      });
    }
    if (this.el == null) {
      let el3 = document.getElementById("main-tab-selected");
      if (el3 != null) {
        el3.addEventListener('animationend', function (e) {
          e.preventDefault();
          t.tabAnimation = '';
          t.margin = t.width * t.page;
          switch (t.page) {
            case 0:
              t.pageMargin = 3 * t.width;
              break;
            case 1:
              t.pageMargin = 0;
              break;
            case 2:
              t.pageMargin = -3 * t.width;
          }
          t.pageAnim0 = '';
          t.pageAnim1 = '';
          t.pageAnim2 = '';
        }, false);
      }
      this.el = document.getElementById('page-container');
      if (this.el) {
        this.el.addEventListener('animationend', function (e) {
          e.preventDefault();
          t.tabAnimation = '';
          t.margin = t.width * t.page;
          switch (t.page) {
            case 0:
              t.pageMargin = 3 * t.width;
              break;
            case 1:
              t.pageMargin = 0;
              t.mapController.enableSwipe$.emit(true);
              break;
            case 2:
              t.pageMargin = -3 * t.width;
          }
          t.pageAnim0 = '';
          t.pageAnim1 = '';
          t.pageAnim2 = '';
          t.searchController.onChangeSearchButtonVisibility$.emit(t.page != 2);
        }, false);
        this.el.addEventListener('touchstart', function (e) {
          if (t.pageMargin % (3 * t.width) != 0) {
            t.swipeTouchEnd();
          }
          let touch = e.touches[0];
          t.startTouchX = touch.pageX;
          let touchZone = t.width * 0.15;
          t.swipeEnabled = !t.blur && ((t.page == 2) || (t.startTouchX < touchZone || t.startTouchX > 3 * t.width - touchZone));
          if (t.page == 1 && t.swipeEnabled) {
            t.mapController.enableSwipe$.emit(false);
          }
        });
        this.el.addEventListener('touchmove', function (e) {
          if (t.swipeEnabled) {
            let touch = e.touches[0];
            t.moveTouchX = t.startTouchX;
            t.startTouchX = touch.pageX;
            t.margin += (t.moveTouchX - t.startTouchX) / 3;
            if (t.margin >= 0 && t.margin <= 2 * t.width) {
              if (t.margin > t.width * 3) {
                t.margin = t.width * 3;
              } else if (t.margin < 0) {
                t.margin = 0;
              }
              t.pageMargin -= (t.moveTouchX - t.startTouchX);
              if (t.pageMargin < -t.width * 3) {
                t.pageMargin = -t.width * 3;
              } else if (t.pageMargin > t.width * 3) {
                t.pageMargin = t.width * 3;
              }
              if (t.margin < t.width + t.width / 2) {
                t.page = 1;
                t.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
              }
              if (t.page == 2 && t.pageMargin > 0) {
                t.pageMargin = 0;
                t.margin = t.width;
                t.mapController.enableSwipe$.emit(true);
              } else if (t.page == 0 && t.pageMargin < 0) {
                t.pageMargin = 0;
                t.margin = t.width;
                t.mapController.enableSwipe$.emit(true);
              }
            } else {
              if (t.margin < 0) {
                t.margin = 0;
              } else if (t.margin > 2 * t.width) {
                t.margin = 2 * t.width;
              }
            }
          }
        });
        this.el.addEventListener('touchend', function (e) {
          t.swipeTouchEnd();
        });
      }
    }
  }

  private swipeTouchEnd() {
    this.tabAnimation = this.TAB_ANIM;
    if (this.margin < this.width / 2) {
      this.tabAnimation += 0;
      this.page = 0;
      this.menuController.disableMenuSwipe$.emit(MenuController.MENU_ENABLE);
      this.pageAnim0 = this.PAGE_ANIM + 1;
      this.pageAnim1 = this.PAGE_ANIM + 2;
      this.pageAnim2 = this.PAGE_ANIM + 2;
    } else if (this.margin < this.width + this.width / 2) {
      this.tabAnimation += 1;
      this.page = 1;
      this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
      this.pageAnim0 = this.PAGE_ANIM + 0;
      this.pageAnim1 = this.PAGE_ANIM + 1;
      this.pageAnim2 = this.PAGE_ANIM + 2;
    } else {
      this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
      this.page = 2;
      this.tabAnimation += 2;
      this.pageAnim0 = this.PAGE_ANIM + 0;
      this.pageAnim1 = this.PAGE_ANIM + 0;
      this.pageAnim2 = this.PAGE_ANIM + 1;
    }
    this.tokenService.setPageState(this.page);
  }

  initMap() {
    if (!this.mapData.mapInit) {
      this.load().then(() => {
        this.mapData.mapInit = true;
        this.mapController.setData$.emit(true);
      }).catch((error) => {
        console.log("ERROR: " + error.toString());
      });
    }
  }

  ngOnInit() {
    this.initMap();
    let data = this.tokenService.getSearchData();
    this.searchString = data.text == null || data.text.length == 0 ? '' : data.text;
    this.category = data.category == null ? -1 : data.category;
    this.page = this.tokenService.getPageState();
    this.searchController.onChangeSearchButtonVisibility$.emit(this.page != 2);
    this.menuController.disableMenuSwipe$.emit(this.page == 0 ? MenuController.MENU_ENABLE : MenuController.MENU_DISABLE);
    this.width = window.innerWidth / 3;
    this.margin = this.page * this.width;
    this.error = '';
    switch (this.page) {
      case 0:
        this.pageMargin = 3 * this.width;
        break;
      case 1:
        this.pageMargin = 0;
        break;
      case 2:
        this.pageMargin = -3 * this.width;
    }

    this.loadAvailableServices();

  }

  ngOnDestroy(): void {
    this.searchController.onChangeSearchButtonVisibility$.emit(SearchController.SEARCH_HIDE);
    this.menuController.disableMenuSwipe$.emit(MenuController.MENU_ENABLE);
  }

  public loadAvailableServices() {
    this.mapService.getAvailableServices(this.category, this.searchString).subscribe(
      result => {
        this.listData = {services: [], offerSize: 0, requestSize: 0, more: true};
        if (result.elementsRequest) {

          this.mapData.requestsWindow = result.requestLite;
          this.listData.services = result.elementsRequest;
          this.listData.requestSize = result.elementsRequest.length;
        } else {
          this.mapData.requestsWindow = [];
        }
        if (result.elementsOffer) {
          this.listData.offerSize = result.elementsOffer.length;
          this.mapData.offersWindow = result.offerLite;
          for (let i = 0; i < result.elementsOffer.length; ++i) {
            this.listData.services.push(result.elementsOffer[i]);
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
    if (pageIndex >= 0 && pageIndex < 3 && this.page != pageIndex) {
      this.tokenService.setPageState(pageIndex);
      if (this.pageMargin < 0) {
        ++this.pageMargin;
      } else {
        --this.pageMargin;
      }
      this.page = pageIndex;
      switch (this.page) {
        case 0:
          this.menuController.disableMenuSwipe$.emit(MenuController.MENU_ENABLE);
          this.pageAnim0 = this.PAGE_ANIM + 1;
          this.pageAnim1 = this.PAGE_ANIM + 2;
          this.pageAnim2 = this.PAGE_ANIM + 2;
          break;
        case 1:
          this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
          this.pageAnim0 = this.PAGE_ANIM + 0;
          this.pageAnim1 = this.PAGE_ANIM + 1;
          this.pageAnim2 = this.PAGE_ANIM + 2;
          break;
        case 2:
          this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
          this.pageAnim0 = this.PAGE_ANIM + 0;
          this.pageAnim1 = this.PAGE_ANIM + 0;
          this.pageAnim2 = this.PAGE_ANIM + 1;
      }
      this.pagerMargin = 0;
      this.tabAnimation = this.TAB_ANIM + pageIndex;
      this.searchController.onChangeSearchButtonVisibility$.emit(this.page != 2);

    }
  }

  private load(): Promise<void> {
    const callbackName = 'initMap';
    const scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCvn27CPRnDIm_ROE-Q8U-x2pUYep7yCmU&callback=' + callbackName;
    let scripts: any = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i) {
      if (scripts[i].src == scriptSrc) {
        this.scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
          resolve();
        });
        return this.scriptLoadingPromise;
      }
    }
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;

    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = scriptSrc;

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

  loadMoreElementMap() {
    if (this.page == 0) {
    }
    this.mapService.getMoreAvailableServices(this.category, this.searchString, this.listData.offerSize, this.listData.requestSize).subscribe(
      result => {
        let more = 0;
        if (this.listData.requestSize > -1 && result.requests) {
          let rlength: number = result.requests.length;
          for (let i = 0; i < rlength; ++i) {
            this.listData.services.push(result.requests[i]);
          }
          if (rlength >= MainComponent.PAGE_SIZE) {
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
          if (olength >= MainComponent.PAGE_SIZE) {
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

  getData(page: number): any {
    switch (page) {
      case 0:
        return this.mapData;
      case 1:
        return this.listData;
      case 2:
        break;
    }
  }

  public onMainScroll() {
    let e: HTMLElement = document.getElementById("page-container");
    if (e != null) {
      this.scrollUpVisibility = e.scrollTop > window.innerHeight * 3;
      this.notifyScrollTo(e.scrollTop);
      if (e.scrollHeight - e.scrollTop <= document.body.offsetHeight) {
        this.notifier.userScrolledToTheBottom$.emit(true);
      }
    }
  }

  public onClickScrollUp() {
    let e: HTMLElement = document.getElementById("page-container");
    if (e != null) {

      this.notifyScrollTo(0);
      let cosParameter = e.scrollTop / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();

      let step = function(newTimestamp) {
        scrollCount += Math.PI / (500 / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) e.scrollTop = 0;
        if (e.scrollTop === 0) return;
        e.scrollTop = Math.round(cosParameter + cosParameter * Math.cos(scrollCount));
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
      }

      window.requestAnimationFrame(step);
    }
  }

  notifyScrollTo(pos: number) {
    this.pagerMargin = pos;
    if (this.pagerMargin > 50) {
      this.pagerMargin = 50;
    } else if (this.pagerMargin < 0) {
      this.pagerMargin = 0;
    }
  }

  onClickService(id: number, type: boolean, location: string) {
    if (location != null) {
      let coordinate = this.getCoordinates(location);
      this.elementCoordinates.lat = coordinate.lat;
      this.elementCoordinates.lng = coordinate.lng;
      this.elementCoordinates.dist = 0;
    }
    this.loadDialog(type, id);
  }

//Service dialog methods
  private loadDialog(type: boolean, id: number) {
    this.serviceDialogController.loading$.emit(true);
    if (type) {
      this.offerService.getOfferDialogData(id).subscribe(
        value => {
          this.blur = true;
          let data: any = {service: value.offer, user: value.user};
          this.serviceDialogController.setData$.emit(data);
        },
        error => {
          this.blur = false;
          this.serviceDialogController.setData$.emit(null);
          this.dialog.notifyError(error)
        }
      );
    } else {
      this.requestService.getRequestDialogData(id).subscribe(
        value => {
          this.blur = true;
          let data: any = {service: value.request, user: value.user};
          this.serviceDialogController.setData$.emit(data);
        },
        error => {
          this.blur = false;
          this.serviceDialogController.setData$.emit(null);
          this.dialog.notifyError(error)
        }
      );
    }
  }

  public onClickNext(value: any) {
    let t = this.searchElement(true);
    if (t != null) {
      let type: boolean = value.oid;
      let id = !type ? value.rid : value.oid;
      if ((type != t.type || id != t.id) && t.dist >= this.elementCoordinates.dist) {
        this.elementCoordinates.dist = t.dist;
        this.loadDialog(t.type, t.id);
      } else {
        this.serviceDialogController.setData$.emit(null);
      }
    } else {
      this.serviceDialogController.setData$.emit(null);
    }
  }

  public onClickPrevious(value: any) {
    let t = this.searchElement(false);
    if (t != null) {
      let type: boolean = value.oid;
      let id = !type ? value.rid : value.oid;
      if ((type != t.type || id != t.id) && t.dist <= this.elementCoordinates.dist) {
        this.elementCoordinates.dist = t.dist;
        this.loadDialog(t.type, t.id);
      } else {
        this.serviceDialogController.setData$.emit(null);
      }
    } else {
      this.serviceDialogController.setData$.emit(null);
    }
  }

  public onClickOpen(element: any) {
    let type: boolean = element.rid;
    this.router.navigate([DETAIL + (type ? element.rid : element.oid) + '/' + (type ? 0 : 1) + '/' + 0]);
  }

  public onClickClose() {
    this.blur = false;
  }

  private searchElement(direction: boolean): any {
    let req = this.calculateMinDistance(this.mapData.requestsWindow, direction);
    let off = this.calculateMinDistance(this.mapData.offersWindow, direction);

    if (req == null) {
      if (off == null) {
        return null;
      }
      return {id: off[0], type: true, dist: off[1]}
    }
    if (off == null) {
      if (req == null) {
        return null;
      }
      return {id: req[0], type: false, dist: req[1]}
    }
    if (direction) {
      let type: boolean = req[1] > off[1];
      return {id: type ? off[0] : req[0], type: type, dist: !type ? req[1] : off[1]}
    } else {
      let type = req[1] < off[1];
      return {id: type ? off[0] : req[0], type: type, dist: !type ? req[1] : off[1]}
    }
  }

  private calculateMinDistance(list: any[], direction: boolean): any {
    let closest = -1;
    let R = 6371; // radius of earth in km

    let distance: number = direction ? Number.MAX_VALUE : 0;
    for (let i = 0; i < list.length; i++) {
      let coordinate = this.getCoordinates(list[i].location);
      if (coordinate != null) {
        let dLat = this.rad(coordinate.lat - this.elementCoordinates.lat);
        let dLong = this.rad(coordinate.lng - this.elementCoordinates.lng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(this.elementCoordinates.lat)) * Math.cos(this.rad(this.elementCoordinates.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        if (direction) {
          if (d < distance && d > this.elementCoordinates.dist && d != 0) {
            closest = i;
            distance = d;
          }
        } else {
          if (d > distance && d < this.elementCoordinates.dist && d != 0) {
            closest = i;
            distance = d;
          }
        }
      }
    }
    if (closest == -1) {
      return null;
    }
    return [list[closest].oid ? list[closest].oid : list[closest].rid, distance];
  }

  private rad(x) {
    return x * Math.PI / 180;
  }

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
  }

  //Bid Dialog
  onBidClickClose() {
    this.showBid = false;
  }

  onClickServiceDialogSendBid(event) {
    this.onBidClickSendOffer(event.oid, event.oid ? event.oid : event.rid)
  }

  onBidClickSendOffer(type: boolean, id: number) {
    this.showBid = true;
    this.bid.type = type;
    this.bid.sid = id;
    this.bid.price = '';
    this.bid.description = '';

  }

  onBidClickSend() {
    this.bidService.savePid(this.bid).subscribe(
      data => {
        this.dialog.sendMessage("Bid sent!");
      },
      error => {
        this.dialog.notifyError(error);
      });
  }

  onBidKeyPrice(event) {
    this.bid.price = event;
  }

  onBidKeyDescription(event) {
    this.bid.description = event;
  }
}
