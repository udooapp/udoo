import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../../../services/map.service";
import {Offer} from "../../../entity/offer";
import {Request} from "../../../entity/request";
import {DETAIL} from "../../../app/app.routing.module";
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
export class MainListComponent extends ConversionMethods implements OnInit {

  public types: string[] = ['Select', 'Offer', 'Request'];
  public category = -1;
  public type: number = 0;
  public search: string = '';
  public services: any[] = [];
  public scrolledDown: boolean = true;
  private loaded = false;
  private noMoreElement: boolean = false;
  @Input() result: any[] = [];
  @Input() searchListener: MainSearchListener;
  @Input() categories: any[] = [{cid: -1, name: ''}];

  @Input()
  set service(data: any) {
    if (data != null) {
      if(data.more != true) {
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
      this.loaded =  true;
      data = this.searchListener.getSearchData();
      this.search = data.text;
      this.type = data.type;
      this.category = data.category
    }
  }

  constructor(private router: Router, private notifier: NotifierController, private listController: ListMainController) {
    super();
    notifier.userScrolledToTheBottom$.subscribe(() => {
      if (!this.scrolledDown && !this.noMoreElement) {
        this.scrolledDown = true;
        this.searchListener.loadMoreElement();
      }
    });
    listController.setData$.subscribe(data=>{
          if(this.loaded) {
            if (data.more != true) {
              this.noMoreElement = true;
              this.scrolledDown = false;
            }
            if (data.services.length > 0) {
              this.scrolledDown = false;
              this.services = data.services;
            }
          }
    })
  }


  public getPicture(index: number) {
    if (this.services.length >= 0 && index < this.services.length) {
      let type: boolean = this.services[index].rid;
      if ((type ? this.services[index].picturesRequest.length : this.services[index].picturesOffer.length) > 0) {
        return type ? this.services[index].picturesRequest[0].src : this.services[index].picturesOffer[0].src;
      }
    }
    return '';
  }

  public onClickOpen(element: any) {
    let type: boolean = element.rid;
    this.router.navigate([DETAIL + (type ? element.rid : element.oid) + '/' + (type ? 0 : 1) + '/' + 0]);
  }

  public onKey(event: any): void {
    this.searchListener.onKey(event);
  }

  public onChangeTypeSelect(event: any) {
    this.searchListener.onTypeChangeId(event);
  }

  public onChangeCategorySelect(event: any) {
    this.searchListener.onCategoryChange(event);
  }

  public getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' + category + ' id is not exist!';
  }

  public onClickResultDropDown(index: number) {
    this.category = index;
    this.searchListener.onClickResultDropdown(index);
  }
}
