import {Component, Input, NgZone, OnInit} from '@angular/core';
import {Offer} from "../../../entity/offer";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {OfferService} from "../../../services/offer.service";
import {RequestService} from "../../../services/request.service";
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
export class MainMapComponent extends ConversionMethods implements OnInit {

  public types: string[] = ['Select', 'Offer', 'Request'];
  public showSearch = true;
  private map;
  public category = -1;
  public type = 0;
  public search: string = '';
  private markers = [];
  private requestsWindow: any[] = [];
  private icon = {};
  private offersWindow: any[] = [];
  private stompClient: any;

  private loaded = false;
  @Input() result: any[] = [];
  @Input() searchListener: MainSearchListener;
  @Input() categories: any[] = [{cid: -1, name: ''}];

  @Input()
  set service(data: any) {
    if (data.requestsWindow) {
      this.requestsWindow = data.requestsWindow;
      this.offersWindow = data.offersWindow;
      if (data.mapInit) {
        if (this.map == null) {
          this.initMap();
        } else {
          this.deleteMarkers();
          this.loadRequests();
          this.loadOffers();
        }
      }
    } else {
      this.initMap();
    }
  }


  constructor(private mapController: MapMainController, private zone: NgZone) {
    super();
    mapController.setData$.subscribe(data => {
      if (this.loaded) {
        if (data.requestsWindow) {
          this.requestsWindow = data.requestsWindow;
          this.offersWindow = data.offersWindow;
          if (data.mapInit) {
            if (this.map == null) {
              this.initMap();
            } else {
              this.deleteMarkers();
              this.loadRequests();
              this.loadOffers();
            }
          }
        } else {
          this.initMap();
        }
      } else {
        if (this.map == null && data.mapInit) {
          this.initMap();
        }
      }
    });
    mapController.enableSwipe$.subscribe(value=>{
      if(this.map != null){
        this.map.setOptions({draggable: value});
      }
    });
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.211029, lng: 16.373990},
      zoom: 14,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c1c9cb"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebedee"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebedee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#c0c8ca"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#fbfbfc"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#ced4d5"
            },
            {
              "weight": 3.5
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#cdd3d5"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#afb8bb"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#a0abaf"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#c8cfd1"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "transit.station.rail",
          "elementType": "labels",
          "stylers": [
            {
              "color": "#7c7c7c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#c0c7c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#cacfd1"
            },
            {
              "saturation": -100
            },
            {
              "lightness": -55
            },
            {
              "weight": 8
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
    });
    this.icon = {
      url: "assets/pin.png", // url
      scaledSize: new google.maps.Size(30, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    this.markers = [];
    this.loadRequests();
    this.loadOffers();
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
    if (this.searchListener != null) {
      if (this.requestsWindow.length == 0) {
        let data = this.searchListener.getData(0);
        this.requestsWindow = data.requestsWindow;
        this.offersWindow = data.offersWindow;
        if (data.mapInit) {
          this.initMap();
        }
        this.loaded = true;
      }
      let data = this.searchListener.getSearchData();
      this.search = data.text;
      this.type = data.type;
      this.category = data.category
    }
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
          mk.zone.run(() => {
            mk.searchListener.onClickService(request.rid, false, request.location);
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
            mk.searchListener.onClickService(offer.oid, true, offer.location);
          });
        });

        this.markers.push(marker);
      }
    }
  }


  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
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



}
