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


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MapService]
})
export class MainComponent extends ConversionMethods implements OnInit, OnDestroy, AfterViewChecked, MainSearchListener {
  private PAGE_ANIM: string = 'page';
  private TAB_ANIM: string = 'tabPage';
  public page: number = 1;
  public margin: number = 0;
  public type = 0;
  private scriptLoadingPromise: Promise<void>;
  public categories: any[] = [{cid: -1, name: ''}];
  private error: string;
  private category: number = -1;
  private searchString = '';
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

  constructor(private searchController: SearchController, private notifier: NotifierController, private mapService: MapService, private dialog: DialogController, private tokenService: TokenService, private mapController: MapMainController, private listController: ListMainController, private menuController: MenuController) {
    super();
    searchController.onClickSearchButton$.subscribe((value) => {
      this.searchVisibility = true;
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
        t.pageContainerHeight = window.innerHeight - 110;
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
        t.pageContainerHeight = window.innerHeight - 110;
      }
    });
    this.pageContainerHeight = window.innerHeight - 110;

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
        if(t.pagerMargin > 25){
          t.pagerMargin = 50;
        } else {
          t.pagerMargin = 0;
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
              t.pagerMargin = 0;
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
          t.swipeEnabled = (t.page != 1) || (t.startTouchX < touchZone || t.startTouchX > 3 * t.width - touchZone);
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
              if(t.margin < 0){
                t.margin = 0;
              } else if( t.margin > 2 * t.width){
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
    } else if (this.margin < this.width + this.width / 2) {
      this.tabAnimation += 1;
      this.page = 1;
      this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
    } else {
      this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
      this.page = 2;
      this.tabAnimation += 2;
    }
    this.tokenService.setPageState(this.page);
    switch (this.page) {
      case 0:
        this.pageAnim0 = this.PAGE_ANIM + 1;
        this.pageAnim1 = this.PAGE_ANIM + 2;
        this.pageAnim2 = this.PAGE_ANIM + 2;
        break;
      case 1:
        this.pageAnim0 = this.PAGE_ANIM + 0;
        this.pageAnim1 = this.PAGE_ANIM + 1;
        this.pageAnim2 = this.PAGE_ANIM + 2;
        break;
      case 2:
        this.pageAnim0 = this.PAGE_ANIM + 0;
        this.pageAnim1 = this.PAGE_ANIM + 0;
        this.pageAnim2 = this.PAGE_ANIM + 1;
    }
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
    this.type = data.type == null ? 0 : data.type;
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

  ngOnDestroy(): void {
    this.searchController.onChangeSearchButtonVisibility$.emit(SearchController.SEARCH_HIDE);
    this.menuController.disableMenuSwipe$.emit(MenuController.MENU_ENABLE);
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
          this.pagerMargin = 0;
          break;
        case 2:
          this.menuController.disableMenuSwipe$.emit(MenuController.MENU_DISABLE);
          this.pageAnim0 = this.PAGE_ANIM + 0;
          this.pageAnim1 = this.PAGE_ANIM + 0;
          this.pageAnim2 = this.PAGE_ANIM + 1;
      }
      this.tabAnimation = this.TAB_ANIM + pageIndex;
      this.searchController.onChangeSearchButtonVisibility$.emit(this.page != 2);

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

  loadMoreElementMap() {
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
    this.notifyScrollTo(e.scrollTop);
    if (e.scrollHeight - e.scrollTop <= document.body.offsetHeight) {
      this.notifier.userScrolledToTheBottom$.emit(true);
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
}
