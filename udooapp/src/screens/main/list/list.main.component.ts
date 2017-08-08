import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {MapService} from "../../../services/map.service";
import {Offer} from "../../../entity/offer";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {NotifierController} from "../../../controllers/notify.controller";
import {OfferService} from "../../../services/offer.service";
import {RequestService} from "../../../services/request.service";
import {MainSearchListener} from "../main.search.listener";
import {ListMainController} from "./list.main.controller";


@Component({
  selector: 'main-list',
  templateUrl: './list.main.component.html',
  styleUrls: ['./list.main.component.css'],
  providers: [MapService, OfferService, RequestService]
})
export class MainListComponent extends ConversionMethods implements OnInit, AfterViewChecked {

  public types: string[] = ['Select', 'Offer', 'Request'];
  public category = -1;
  public type: number = 0;
  public search: string = '';
  public services: any[] = [];
  public scrolledDown: boolean = false;
  private loaded = false;
  private noMoreElement: boolean = false;
  public serviceMargin: number = 0;
  public selectedService: number = 0;
  private selectedServiceStartX: number = 0;
  private attachedSwipes: any[] = [];
  private swipeWidth;
  @Input() result: any[] = [];
  @Input() searchListener: MainSearchListener;
  @Input() categories: any[] = [{cid: -1, name: ''}];

  @Input()
  set service(data: any) {
    if (data != null) {
      if (data.more != true) {
        this.scrolledDown = false;
      }
      if (data.services.length > 0) {
        this.scrolledDown = false;
        this.services = data.services;
      }
    }
  }


  ngOnInit(): void {
    if (this.searchListener != null) {
      let data = this.searchListener.getData(1);
      this.services = data.services;
      this.loaded = true;
      data = this.searchListener.getSearchData();
      this.search = data.text;
      this.type = data.type;
      this.category = data.category
    }
  }

  constructor(private notifier: NotifierController, private listController: ListMainController) {
    super();
    this.swipeWidth = window.innerWidth * 0.85;
    notifier.userScrolledToTheBottom$.subscribe(() => {
      if (!this.scrolledDown && !this.noMoreElement) {
        this.scrolledDown = true;
        this.searchListener.loadMoreElementMap();
      }
    });
    listController.setData$.subscribe(data => {
      if (this.loaded) {
        if (data.more != true) {
          this.noMoreElement = true;
          this.scrolledDown = false;
        }
        if (data.services.length > 0) {
          this.scrolledDown = false;
          this.services = data.services;
        }
      }
    });
    let t = this;
    window.addEventListener("orientationchange", function () {
      let el = document.getElementById('main-list-service');
      if(el != null){
        t.swipeWidth = el.clientWidth * 0.85
      }
    });
    window.addEventListener("resize", function () {
      let el = document.getElementById('main-list-service');
      if(el != null){
        t.swipeWidth = el.clientWidth * 0.85
      }
    });
  }


  public getPicture(index: number) {
    if (this.services.length >= 0 && index < this.services.length && this.services[index].picture.length > 0) {
      return this.services[index].picture;
    }
    return '';
  }

  ngAfterViewChecked(): void {
    let el = document.getElementById('main-list-service');
    if(el != null){
      this.swipeWidth = el.clientWidth * 0.85
    }
    for (let i = 0; i < this.services.length; ++i) {
      if (this.attachedSwipes.length <= i || this.attachedSwipes[i] == null) {
        this.attachSwipeMethods(i);
      }
    }
  }

  private attachSwipeMethods(i) {
    let el = document.getElementById('main-list-service-button-container' + i);
    if (el != null) {
      let t = this;
      el.addEventListener('touchstart', function (e) {
        if (t.selectedService != i) {
          t.serviceMargin = 0;
        }
        t.selectedService = i;
        let touch = e.touches[0];
        t.selectedServiceStartX = touch.pageX;
      });
      el.addEventListener('touchmove', function (e) {
        let touch = e.touches[0];
        t.serviceMargin -= touch.pageX - t.selectedServiceStartX;
        t.selectedServiceStartX = touch.pageX;
        if(t.serviceMargin < 0){
          t.serviceMargin = 0;
        }
        if(t.serviceMargin > t.swipeWidth){
          t.serviceMargin = t.swipeWidth;
        }
      });
      el.addEventListener('touchend', function (e) {
        if(t.serviceMargin > t.swipeWidth / 2){
          t.serviceMargin = t.swipeWidth;
        } else if(t.serviceMargin <= t.swipeWidth / 2){
          t.serviceMargin = 0;
        }

      });
      this.attachedSwipes.push(el);
    }
  }

  public onClickOpen(element: any) {
    this.searchListener.onClickService(element.id, element.type, element.location);
  }
  public onClickSendOffer(element: any) {
    this.searchListener.onBidClickSendOffer(element.type, element.id);
  }

  public onKey(event: any): void {
    this.noMoreElement = false;
    this.searchListener.onKey(event);
  }

  public onChangeTypeSelect(event: any) {
    this.searchListener.onTypeChangeId(event);
  }

  public onChangeCategorySelect(event: any) {
    this.noMoreElement = false;
    this.searchListener.onCategoryChange(event);
  }

  public getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' + category + ' id is not exist!';
  }

  public onClickResultDropDown(index: number) {
    this.category = index;
    this.noMoreElement = false;
    this.searchListener.onClickResultDropdown(index);
  }
}
