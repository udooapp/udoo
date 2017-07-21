import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Offer} from "../../../entity/offer";
import {Request} from "../../../entity/request";
import {DETAIL} from "../../../app/app.routing.module";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {DialogController} from "../../../controllers/dialog.controller";
import {OfferService} from "../../../services/offer.service";
import {RequestService} from "../../../services/request.service";
import {ServiceDialogController} from "../../../components/service/service.window.controller";
import {MainSearchListener} from "../main.search.listener";
import {MapMainController} from "./map.main.controller";

declare let google: any;
// let SockJS = require('sockjs-client');
// let Stomp = require('stompjs');


@Component({
  selector: 'main-map',
  templateUrl: './map.main.component.html',
  styleUrls: ['./map.main.component.css'],
  providers: [OfferService, RequestService]
})
export class MainMapComponent extends ConversionMethods implements OnInit{

  public types: string[] = ['Select', 'Offer', 'Request'];
  public showSearch = true;
  private scriptLoadingPromise: Promise<void>;
  private map;
  public category = -1;
  public type = 0;
  public search: string = '';
  private markers = [];
  private requestsWindow: any[] = [];
  private icon = {};
  private offersWindow: any[] = [];
  private stompClient: any;
  private elementCoordinates: any = {lat: 0, lng: 0, dist: 0};

  @Input() result: any[] = [];
  @Input() searchListener: MainSearchListener;
  @Input() categories: any[] = [{cid: -1, name: ''}];
  @Input() set service(data: any){
    if(data != null){
      this.requestsWindow= data.requestsWindow;
      this.offersWindow = data.offersWindow;
      if(this.map != null){
        this.deleteMarkers();
        this.loadRequests();
        this.loadOffers();
      }
    }
  }


  constructor(private mapController: MapMainController, private serviceController: ServiceDialogController, private zone: NgZone, private requestService: RequestService, private offerService: OfferService, private router: Router, private dialog: DialogController) {
    super();
    mapController.setData$.subscribe(data=>{
      if(data != null){
        this.requestsWindow= data.requestsWindow;
        this.offersWindow = data.offersWindow;
        if(this.map != null){
          this.deleteMarkers();
          this.loadRequests();
          this.loadOffers();
        }
      }
    })
  }

  // connect() {
  //   let socket = new SockJS(config.server + '/socket');
  //   this.stompClient = Stomp.over(socket);
  //   this.stompClient.connect({}, function (frame) {
  //     this.setConnected(true);
  //     console.log('Connected: ' + frame);
  //     this.stompClient.subscribe('/coordinate/message', function (greeting) {
  //       console.log(greeting);
  //     });
  //   });
  // }

  // disconnect() {
  //   if (this.stompClient != null) {
  //     this.stompClient.disconnect();
  //   }
  //   console.log("Disconnected");
  // }
  //
  // sendName() {
  //   this.stompClient.send("/rest/hello", {}, 'Hello');
  // }

  ngOnInit(): void {
    if(this.searchListener != null){
      let data = this.searchListener.getSearchData();
      this.search = data.text;
      this.type = data.type;
      this.category = data.category
    }
    this.initMap();
  }

  private initMap() {
    this.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.211029, lng: 16.373990},
        zoom: 14,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DEFAULT,
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      });
      this.icon = {
        url: "assets/pin.png", // url
        scaledSize: new google.maps.Size(30, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      this.loadOffers();
      this.loadRequests();
    }).catch((error) => {
      console.log("ERROR: " + error.toString());
    });
  }

  private deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  private loadRequests() {
    let mk = this;
    for (let i = 0; i < this.requestsWindow.length; ++i) {
      let request: any = this.requestsWindow[i];
      let coordinate = this.getCoordinates(request.location);
      if (coordinate != null) {
        let marker = new google.maps.Marker({
          position: coordinate,
          map: this.map,
          title: request.title,
          icon: this.icon
        });

        marker.addListener('click', function () {
          mk.elementCoordinates.lat = coordinate.lat;
          mk.elementCoordinates.lng = coordinate.lng;
          mk.elementCoordinates.dist = 0;
          mk.zone.run(() => {
            mk.loadDialog(false, request.rid);
          });
        });

        this.markers.push(marker);
      }
    }

  }

  private loadOffers() {
    // this.offersRealTime = [];
    // for (let i = 0; i < this.offers.length; ++i) {
    //   if (this.offers[i].realTime) {
    //     this.offersRealTime.push(this.offers[i])
    //   } else {
    //     this.offers.push(this.offers[i])
    //   }
    // }
    let mk = this;
    for (let i = 0; i < this.offersWindow.length; ++i) {
      let offer: any = this.offersWindow[i];
      let coordinate = this.getCoordinates(offer.location);
      if (coordinate != null) {
        let marker = new google.maps.Marker({
          position: coordinate,
          map: mk.map,
          title: offer.title,
          icon: this.icon
        });
        marker.addListener('click', function () {
          mk.zone.run(() => {
            mk.elementCoordinates.lat = coordinate.lat;
            mk.elementCoordinates.lng = coordinate.lng;
            mk.elementCoordinates.dist = 0;
            mk.loadDialog(true, offer.oid);
          });
        });

        this.markers.push(marker);
      }
    }
  }

  private loadDialog(type: boolean, id: number) {
    this.serviceController.loading$.emit(true);
    if (type) {
      this.offerService.getOfferData(id).subscribe(
        value => {
          let data:any = {service: value.offer, user: value.user};
          this.serviceController.setData$.emit(data);
        },
        error => {
          this.serviceController.setData$.emit(null);
          this.dialog.notifyError(error)
        }
      );
    } else {
      this.requestService.getRequestData(id).subscribe(
        value => {
          let data:any = {service: value.request, user: value.user};
          this.serviceController.setData$.emit(data);
        },
        error => {
          this.serviceController.setData$.emit(null);
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
      } else{
        this.serviceController.setData$.emit(null);
      }
    } else {
      this.serviceController.setData$.emit(null);
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
        this.serviceController.setData$.emit(null);
      }
    } else {
      this.serviceController.setData$.emit(null);
    }
  }

  public onClickOpen(element: any) {
    let type: boolean = element.rid;
    this.router.navigate([DETAIL + (type ? element.rid : element.oid) + '/' + (type ? 0 : 1) + '/' + 0]);
  }

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
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
  public onClickSearchPanel() {
    this.showSearch = !this.showSearch;
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



  private searchElement(direction: boolean): any {
    let req = this.calculateMinDistance(this.requestsWindow, direction);
    let off = this.calculateMinDistance(this.offersWindow, direction);

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
}
