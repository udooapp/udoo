import {Component, NgZone, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {Offer} from "../../entity/offer";
import {Request} from "../../entity/request";
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {DETAIL} from "../../app/app.routing.module";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {OfferService} from "../../services/offer.service";
import {RequestService} from "../../services/request.service";
import {ServiceDialogController} from "../../components/service/service.window.controller";
import {config} from "../../environments/url.config";

declare let google: any;
let SockJS = require('sockjs-client');
let Stomp = require('stompjs');


@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService, OfferService, RequestService]
})
export class MapComponent extends ConversionMethods implements OnInit {

  public types: string[] = ['Select', 'Offer', 'Request'];
  public mapView = true;
  public showSearch = true;
  public type = 0;
  public categories: any[] = [{cid: -1, name: ''}];
  private scriptLoadingPromise: Promise<void>;
  private map;
  private error: string;
  private searchString = '';
  public category = -1;
  private markers = [];
  private requestsWindow: any[] = [];
  private services: any[] = [];
  private icon = {};
  private scrolledDown;
  private offersWindow: any[] = [];
  private offerSize: number = 0;
  private requestSize: number = 0;
  public result: any[] = [];
  private stompClient: any;
  private elementCoordinates: any = {lat: 0, lng: 0, dist: 0};


  constructor(private serviceController: ServiceDialogController, private zone: NgZone, private mapService: MapService, private requestService: RequestService, private offerService: OfferService, private router: Router, private dialog: DialogController, private tokenService: TokenService, private notifier: NotifierController) {
    super();
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.loadMoreElements();
    });
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

  ngOnInit() {
   // this.connect();

    this.mapView = !this.tokenService.getMapState();
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
      this.loadAvailableServices();
    }).catch((error) => {
      console.log("ERROR: " + error.toString());
    });

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
    });
  }

  private deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
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

  private loadRequests() {
    let map = this.map;
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

  public findCatName(catID: number): string {
    for (let i = 0; i < this.categories.length; ++i) {
      if (catID == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
  }

  public loadAvailableServices() {
    this.scrolledDown = true;
    this.deleteMarkers();
    this.mapService.getAvailableServices(this.category, this.searchString, this.type).subscribe(
      result => {
        this.scrolledDown = false;
        this.services = [];
        if (result.request) {
          this.requestsWindow = result.requestLite;
          this.services = result.request;
          this.requestSize = result.request.length;
          this.loadRequests();
        } else {
          this.requestsWindow = [];
        }
        if (result.offer) {

          this.offerSize = result.offer.length;
          this.offersWindow = result.offerLite;
          for (let i = 0; i < result.offer.length; ++i) {
            this.services.push(result.offer[i]);
          }
          this.loadOffers();
        } else {
          this.offersWindow = [];
        }
      },
      error => {
        this.scrolledDown = false;
        this.error = error;
        this.checkError();
      }
    );
  }

  private checkError() {
    this.dialog.notifyError(this.error);
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

  public onKey(event: any): void {
    if (event.which === 13) {
      this.loadAvailableServices();
    } else {
      this.searchString = event.target.value;
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

  public onClickSearchPanel() {
    this.showSearch = !this.showSearch;
  }

  public onChangeTypeSelect(event: any) {
    if (this.type != event) {
      this.type = event;
      this.loadAvailableServices();
    }
  }

  public onChangeCategorySelect(event: any) {
    if (this.category != event) {
      this.category = event;
      this.loadAvailableServices();
    }
  }

  public showList() {
    this.mapView = !this.mapView;
    this.tokenService.setMapState(!this.mapView);
  }

  public getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' + category + ' id is not exist!';
  }

  public onClickResultDropDown(index: number) {
    this.category = index;
    this.loadAvailableServices();
  }

  private loadMoreElements() {
    if (!this.scrolledDown && (this.requestSize > -1 || this.offerSize > -1)) {
      this.scrolledDown = true;
      this.mapService.getMoreAvailableServices(this.category, this.searchString, this.type, this.offerSize, this.requestSize).subscribe(
        result => {
          this.scrolledDown = false;
          if (this.requestSize > -1 && result.requests) {
            let rlength: number = result.requests.length;
            for (let i = 0; i < rlength; ++i) {
              this.services.push(result.requests[i]);
            }
            if (rlength >= 5) {
              this.requestSize += rlength;
            } else {
              this.requestSize = -1;
            }
          }
          if (this.offerSize > -1 && result.offers) {
            let olength: number = result.offers.length;
            for (let i = 0; i < olength; ++i) {
              this.services.push(result.offers[i]);
            }
            if (olength >= 5) {
              this.offerSize += olength;
            } else {
              this.offerSize = -1;
            }
          }
        },
        error => {
          this.scrolledDown = false;
          this.dialog.notifyError(error);
        }
      );
    }
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
