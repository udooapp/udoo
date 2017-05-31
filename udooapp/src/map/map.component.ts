import {Component, OnInit} from '@angular/core';
import {MapService} from "../services/map.service";
import {Offer} from "../entity/offer";
import {Request} from "../entity/request";
import {Router} from "@angular/router";

declare let google: any;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {

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
  private requests: Request[] = [];
  private icon = {};
  private offers: Offer[] = [];

  constructor(private mapService: MapService, private router: Router) {
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
        this.requests = requests;
        let click: boolean[] = [];
        let rout = this.router;
        let map = this.map;
        for (let i = 0; i < requests.length; ++i) {
          let coordinate = this.getAddress(requests[i].location);
          if (coordinate != null) {
            click.push(false);
            let marker = new google.maps.Marker({
              position: coordinate,
              map: this.map,
              title: requests[i].title,
              icon: this.icon

            });
            let infowindow = new google.maps.InfoWindow({
              content: '<div>' +
              '<h1>' + requests[i].title + '</h1>' +
              '<div>' +
              '<p>' + requests[i].description + '</p>' +
              '<p><a  id="infoWindow-linkr' + requests[i].rid + '"><b>More...</b></a></p>' +
              '<p><b>Category: </b>' + this.findCatName(requests[i].category) + '</p>' +
              '</div>' +
              '</div>',
              maxWidth: 300
            });
            infowindow.addListener('closeclick', function () {
              click[i] = !click[i];
              infowindow.close(map, marker);
            });

            google.maps.event.addListener(infowindow, 'domready', function () {
              document.getElementById('infoWindow-linkr' + requests[i].rid).addEventListener("click", function () {
                rout.navigate(['/detail/' + requests[i].rid + '/0']);
              });
            });
            marker.addListener('mouseover', function () {
              infowindow.open(map, marker);
            });
            marker.addListener('click', function () {
              click[i] = !click[i];
              infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function () {
              if (!click[i]) {
                infowindow.close(map, marker);
              }
            });
            this.markers.push(marker);
          }
        }
      },
      error => this.error = <any>error);
  }

  loadOffers() {
    this.mapService.getOfferLocations(this.category, this.searchString).subscribe(
      offers => {
        this.offers = offers;
        let map = this.map;
        let rout = this.router;
        let click: boolean[] = [];
        for (let i = 0; i < offers.length; ++i) {
          let coordinate = this.getAddress(offers[i].location);
          if (coordinate != null) {

            click.push(false);
            let marker = new google.maps.Marker({
              position: coordinate,
              map: this.map,
              title: offers[i].title,
              icon: this.icon
            });
            let infowindow = new google.maps.InfoWindow({
              content: '<div >' +
              '<h1>' + offers[i].title + '</h1>' +
              '<div>' +
              '<p>' + offers[i].description + '</p>' +
              '<p><a class="link" id="infoWindow-linko' + offers[i].oid + '"><b>More...</b></a></p>' +
              '<p><b>Category: </b>' + this.findCatName(offers[i].category) + '</p>' +
              '</div>' +
              '</div>',
              maxWidth: 300
            });

            google.maps.event.addListener(infowindow, 'domready', function () {
              document.getElementById('infoWindow-linko' + offers[i].oid).addEventListener("click", function () {
                rout.navigate(['/detail/' + offers[i].oid + '/1']);
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
              click[i] = !click[i];
              infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function () {
              if (!click[i]) {
                infowindow.close(map, marker);
              }
            });
            this.markers.push(marker);
          }
        }
      },
      error => this.error = <any>error);
  }

  findCatName(catID: number): string {
    for (let i = 0; i < this.categories.length; ++i) {
      if (catID == this.categories[i].cid) {
        return this.categories[i].name;
      }
    }
    return 'Unknown category';
  }

  getAddress(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null
    }
    return JSON.parse(location).coordinate;
  }

  convertMillisToDate(millis: number): string {
    let date: Date = new Date(millis);
    return date.getFullYear() + '/' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '/' + (date.getDay() > 9 ? date.getDay() : '0' + date.getDay());
  }

  refresh() {
    this.deleteMarkers();
    if (this.type == 0) {
      this.loadRequests();
      this.loadOffers();

    } else if (this.type == 1) {
      this.loadOffers();
      this.requests = [];
    } else if (this.type == 2) {
      this.loadRequests();
      this.offers = [];
    }
  }

  ngOnInit() {
    this.mapService.getCategories().subscribe(
      data => {
        data.splice(0, 0, {cid: "-1", name: 'Select category'});
        this.categories = data;
      },
      error => this.error = <any>error
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
      this.loadRequests();
      this.loadOffers();
    });

  }

  getLocation(object: string): String {
    if (object == null || object === 'null' || object.length == 0 || !object.match('address')) {
      return '';
    }
    return JSON.parse(object).address;
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
    if (this.type != event) {
      this.type = event;
      this.refresh();
    }
  }

  onChangeCategorySelect(event: any) {
    if (this.category != event) {
      this.category = event;
      this.refresh()
    }
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '/assets/profile_picture.png';
    }
    return url;
  }

  showList() {
    this.mapView = !this.mapView;
  }

  getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' + category + ' id is not exist!';
  }

  onClickService(type: boolean, id: number) {
    this.router.navigate(['/detail/' + id + '/' + (type ? 1 : 0)]);
  }

}
