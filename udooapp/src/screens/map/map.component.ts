import {Component, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {Offer} from "../../entity/offer";
import {Request} from "../../entity/request";
import {Router} from "@angular/router";
import {NotifierController} from "../../controllers/notify.controller";
import {TokenService} from "../../services/token.service";
import {DETAIL} from "../../app/app.routing.module";
// import {Observable} from "rxjs/Observable";
// import {config} from "../../environments/url.config";
import {ConversionMethods} from "../layouts/conversion.methods";
import {DialogController} from "../../controllers/dialog.controller";

declare let google: any;
//var SockJS = require('sockjs-client');
//var Stomp = require('stompjs');

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
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
  private category = -1;
  private markers = [];
  private infoWindows = [];
  private requests: Request[] = [];
  private icon = {};
  private offers: Offer[] = [];
//  private offersRealTime: Offer[] = [];
  private result: any[] = [];
//  private stompClient: any;
  // messages: Array<string> = new Array<string>();

  constructor(private mapService: MapService, private router: Router, private dialog: DialogController, private tokenService: TokenService) {
    super();
    dialog.errorResponse$.subscribe(again => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  send() {
    // let uids: number[] = [];
    // for (let i = 0; i < this.offersRealTime.length; ++i) {
    //   if (uids.indexOf(this.offersRealTime[i].uid) == -1) {
    //     uids.push(this.offersRealTime[i].uid);
    //   }
    // }
    // if(uids.length > 0) {
    //   this.stompClient.send('/coordinates/', {}, JSON.stringify(uids));
    // }
  }

  connect() {
    //   let that = this;
    //   let socket = new SockJS(config.server + '/coordinates');
    //   this.stompClient = Stomp.over(socket);
    //   this.stompClient.connect({}, function (frame) {
    //     console.log('Connected: ' + frame);
    //     that.stompClient.subscribe('/location/messages', function (greeting) {
    //       //let coordianate = JSON.parse(greeting);
    //       console.log("Socket response: " + greeting.toString());
    //
    //     });
    //   }, function (err) {
    //     console.log('err', err);
    //   });
  }

  ngOnInit() {
    //   this.connect();

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
    this.infoWindows = [];
  }

  private loadRequests() {
    let click: boolean[] = [];
    let rout = this.router;
    let map = this.map;
    let mk = this;
    for (let i = 0; i < this.requests.length; ++i) {
      let request: Request = this.requests[i];
      let coordinate = this.getCoordinates(request.location);
      if (coordinate != null) {
        click.push(false);
        let marker = new google.maps.Marker({
          position: coordinate,
          map: this.map,
          title: request.title,
          icon: this.icon

        });
        let infowindow = new google.maps.InfoWindow({
          content: '<div>' +
          '<h1>' + request.title + '</h1>' +
          '<div>' +
          '<p>' + request.description + '</p>' +
          '<p><a  id="infoWindow-linkr' + request.rid + '"><b>More...</b></a></p>' +
          '<p><b>Category: </b>' + this.findCatName(request.category) + '</p>' +
          '</div>' +
          '</div>',
          maxWidth: 300
        });
        infowindow.addListener('closeclick', function () {

          click[i] = !click[i];
          infowindow.close(map, marker);
        });

        google.maps.event.addListener(infowindow, 'domready', function () {
          document.getElementById('infoWindow-linkr' + request.rid).addEventListener("click", function () {
            rout.navigate([DETAIL + request.rid + '/0']);
          });
        });
        marker.addListener('mouseover', function () {
          infowindow.open(map, marker);
        });
        marker.addListener('click', function () {
          mk.closeAllInfoWindows();
          click[i] = !click[i];
          infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function () {
          if (!click[i]) {
            infowindow.close(map, marker);
          }
        });
        this.markers.push(marker);
        this.infoWindows.push(infowindow);
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
    let map = this.map;
    let rout = this.router;
    let click: boolean[] = [];
    let mk = this;
    for (let i = 0; i < this.offers.length; ++i) {
      let offer: Offer = this.offers[i];
      let coordinate = this.getCoordinates(offer.location);
      if (coordinate != null) {

        click.push(false);
        let marker = new google.maps.Marker({
          position: coordinate,
          map: this.map,
          title: offer.title,
          icon: this.icon
        });
        let infowindow = new google.maps.InfoWindow({
          content: '<div >' +
          '<h1>' + offer.title + '</h1>' +
          '<div>' +
          '<p>' + offer.description + '</p>' +
          '<p><a class="link" id="infoWindow-linko' + offer.oid + '"><b>More...</b></a></p>' +
          '<p><b>Category: </b>' + this.findCatName(offer.category) + '</p>' +
          '</div>' +
          '</div>',
          maxWidth: 300
        });

        google.maps.event.addListener(infowindow, 'domready', function () {

          document.getElementById('infoWindow-linko' + offer.oid).addEventListener("click", function () {
            rout.navigate([DETAIL + offer.oid + '/1']);
          });
        });
        infowindow.addListener('closeclick', function () {
          click[i] = !click[i];
          infowindow.close(map, marker);
        });
        marker.addListener('mouseover', function () {
          infowindow.open(map, marker);
        });

        marker.addListener('click', function () {
          mk.closeAllInfoWindows();
          click[i] = !click[i];
          infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function () {
          if (!click[i]) {
            infowindow.close(map, marker);
          }
        });
        this.markers.push(marker);
        this.infoWindows.push(infowindow);
      }
    }


  }

  private closeAllInfoWindows() {
    for (let i = 0; i < this.infoWindows.length; i++) {
      this.infoWindows[i].close();
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

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
  }

  private loadAvailableServices() {
    this.deleteMarkers();
    this.mapService.getAvailableServices(this.category, this.searchString, this.type).subscribe(
      result => {
        if (result.request) {
          this.requests = result.request;
          this.loadRequests();
        } else {
          this.requests = [];
        }
        if (result.offer) {
          this.offers = result.offer;
          this.loadOffers();
        } else {
          this.offers = [];
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

  public onClickService(type: boolean, id: number) {
    this.router.navigate([DETAIL + id + '/' + (type ? 1 : 0)]);
  }

  public onClickResultDropDown(index: number) {
    this.category = index;
    this.loadAvailableServices();
  }
}
