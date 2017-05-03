import {Component, OnInit} from '@angular/core';
import {MapService} from "../services/map.service";
import {Offer} from "../entity/offer";
import {Request} from "../entity/request";

declare var google: any;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {

  private scriptLoadingPromise: Promise<void>;
  private map;
  private requests: Request[];
  private offers: Offer[];
  private error: string;
  constructor(private mapService: MapService) {
  }

  refresh() {
    this.mapService.getRequestLocations().subscribe(
      data => {
        this.requests = data;
        for (let i = 0; i < this.requests.length; ++i) {
          let marker = new google.maps.Marker({
            position: JSON.parse(this.requests[i].location).coordinate,
            map: this.map,
            title: this.requests[i].title

          });
          let infowindow = new google.maps.InfoWindow({
            content: '<div>' +
            '<h1>'+ this.requests[i].title + '</h1>' +
            '<div>' +
            '<p>' + this.requests[i].description + '</p>' +
            '<p><b>Category: </b>' + this.requests[i].category + '</p>' +
            '<p><b>Address: </b>' + JSON.parse(this.requests[i].location).address + '</p>' +
            '</div>' +
            '</div>'
          });
          let map = this.map;
           marker.addListener('mouseover', function() {
             infowindow.open(map, marker);
           });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
          marker.addListener('mouseout', function() {
            infowindow.close(map, marker);
          });
        }
      },
      error => this.error = <any>error);
    this.mapService.getOfferLocations().subscribe(
      data => {
        this.offers = data;
        for (let i = 0; i < this.offers.length; ++i) {
          let marker = new google.maps.Marker({
            position: JSON.parse(this.offers[i].location).coordinate,
            map: this.map,
            title: this.offers[i].title
          });

          let infowindow = new google.maps.InfoWindow({
            content: '<div>' +
                        '<h1>' +this.offers[i].title + '</h1>' +
                        '<div>' +
                          '<p>' + this.offers[i].description + '</p>' +
                          '<p><b>Category: </b>' + this.offers[i].category + '</p>' +
                          '<p><b>Address: </b>' + JSON.parse(this.offers[i].location).address + '</p>' +
                        '</div>' +
                    '</div>'
          });
          let map = this.map;
          marker.addListener('mouseover', function() {
            infowindow.open(map, marker);
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
         marker.addListener('mouseout', function() {
           infowindow.close(map, marker);
         });
        }
      },
      error => this.error = <any>error);
  }

  ngOnInit() {
    this.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.211029, lng: 16.373990},
        zoom: 14
      });
      this.refresh()
    });
  }

  load(): Promise<void> {
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

}
