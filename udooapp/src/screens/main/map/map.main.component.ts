import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ConversionMethods} from "../../layouts/conversion.methods";
import {OfferService} from "../../../services/offer.service";
import {RequestService} from "../../../services/request.service";
import {MainSearchListener} from "../main.search.listener";
import {MapMainController} from "./map.main.controller";
import {mapconfig} from "../../../environments/map.config";

import '../../../javascript/markerCluster/markerclusterer.js'

declare let google: any;
declare let MarkerClusterer;
// let SockJS = require('sockjs-client');
// let Stomp = require('stompjs');

@Component({
  selector: 'main-map',
  templateUrl: './map.main.component.html',
  styleUrls: ['./map.main.component.css'],
  providers: [OfferService, RequestService]
})
export class MainMapComponent extends ConversionMethods implements OnInit {

  private map;
  private markers = [];
  private requestsWindow: any[] = [];
  private icon = {};
  private offersWindow: any[] = [];
  private stompClient: any;
  private markerCluster: any;

  private loaded = false;
  @Input() result: any[] = [];
  @Input() searchListener: MainSearchListener;

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
          this.loadServiceMarkers(this.requestsWindow, false);
          this.loadServiceMarkers(this.offersWindow, true);
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
              this.loadServiceMarkers(this.requestsWindow, false);
              this.loadServiceMarkers(this.offersWindow, true);
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
    mapController.enableSwipe$.subscribe(value => {
      if (this.map != null) {
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
      styles: mapconfig.style
    });
    this.icon = {
      url: "assets/pin.png", // url
      scaledSize: new google.maps.Size(30, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    this.markerCluster = new MarkerClusterer(this.map, this.markers,
      {imagePath: 'assets/maps/m'});
    this.markers = [];
    this.loadServiceMarkers(this.requestsWindow, false);
    this.loadServiceMarkers(this.offersWindow, true);
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
    }
  }

  private deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  private loadServiceMarkers(serviceList: any[], type: boolean) {

    let mk = this;
    for (let i = 0; i < serviceList.length; ++i) {
      let service: any = serviceList[i];
      let coordinate = this.getCoordinates(service.location);
      if (coordinate != null) {
        let marker = new google.maps.Marker({
          position: coordinate,
          icon: this.icon
        });

        marker.addListener('click', function () {
          mk.zone.run(() => {
            mk.searchListener.onClickService(type ? service.oid : service.rid, type, service.location);
          });
        });

        this.markers.push(marker);
      }
    }
    if(type){
      this.markerCluster.clearMarkers();
      this.markerCluster.addMarkers(this.markers, false);
    }
  }

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).coordinate;
  }
}
