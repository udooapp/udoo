import {Component, OnInit} from '@angular/core';
import {MapService} from "../services/map.service";
import {Offer} from "../entity/offer";
import {Request} from "../entity/request";

declare let google: any;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {

  private scriptLoadingPromise: Promise<void>;
  private map;
  private error: string;
  private showSearch = false;
  private searchString = '';
  private type = 0;
  private category = 0;
  private categories: any[] = [{cid : 0, name : ''}];
  private markers = [];
  private types: string[] = ['Select', 'Offer', 'Request'];

  constructor(private mapService: MapService) {
  }

  deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  loadRequests() {
    this.mapService.getRequestLocations(this.category, this.searchString).subscribe(
      requests => {
        for (let i = 0; i <requests.length; ++i) {
          let marker = new google.maps.Marker({
            position: JSON.parse(requests[i].location),
            map: this.map,
            title:requests[i].title,
            icon: '/src/images/icon.png'

          });
          let infowindow = new google.maps.InfoWindow({
            content: '<div>' +
            '<h1>' +requests[i].title + '</h1>' +
            '<div>' +
            '<p>' +requests[i].description + '</p>' +
            '<p><b>Category: </b>' + this.categories.find(cat => cat.cid ===requests[i].category).name + '</p>' +
            '</div>' +
            '</div>'
          });
          let map = this.map;
          marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
          });
          marker.addListener('click', function () {
            infowindow.open(map, marker);
          });
          marker.addListener('mouseout', function () {
            infowindow.close(map, marker);
          });
          this.markers.push(marker);
        }
      },
      error => this.error = <any>error);
  }

  loadOffers() {

    this.mapService.getOfferLocations(this.category, this.searchString).subscribe(
      offers => {
        for (let i = 0; i < offers.length; ++i) {
          let marker = new google.maps.Marker({
            position: JSON.parse(offers[i].location),
            map: this.map,
            title: offers[i].title,
            icon: '/src/images/icon.png'
          });

          let infowindow = new google.maps.InfoWindow({
            content: '<div>' +
            '<h1>' + offers[i].title + '</h1>' +
            '<div>' +
            '<p>' + offers[i].description + '</p>' +
            '<p><b>Category: </b>' + this.categories.find(cat => cat.cid === offers[i].category).name + '</p>' +
            '</div>' +
            '</div>'
          });
          let map = this.map;
          marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
          });
          marker.addListener('click', function () {
            infowindow.open(map, marker);
          });
          marker.addListener('mouseout', function () {
            infowindow.close(map, marker);
          });
          this.markers.push(marker);
        }
      },
      error => this.error = <any>error);
  }

  refresh() {
    this.deleteMarkers();
    if (this.type == 0) {
      this.loadRequests();
      this.loadOffers();

    } else if (this.type == 1) {
      this.loadOffers();
    } else if (this.type == 2) {
      this.loadRequests();
    }
  }

  ngOnInit() {
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
      this.loadRequests();
      this.loadOffers();
    });
    this.mapService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.categories.splice(0, 0, {cid: 0, name: 'Select category'})
      },
      error => this.error = <any>error
    );
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

  onKey(event: any): void {
    if (event.which === 13) {
      this.refresh();
    } else {
      this.searchString = event.target.value;
    }
  }

  onClickSearchPanel() {
    this.showSearch = !this.showSearch;
  }

  onChangeTypeSelect(event: any) {
    if (this.type != event.target.value) {
      this.type = event.target.value;
      this.refresh();
    }
  }

  onChangeCategorySelect(event: any) {
    if (this.category != event.target.value) {
      this.category = event.target.value;
      this.refresh()
    }
  }
}
