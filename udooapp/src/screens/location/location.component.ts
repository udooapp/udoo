import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NotifierController} from "../../controllers/notify.controller";
import {DialogController} from "../../controllers/dialog.controller";
import {mapconfig} from "../../environments/map.config";

declare let google: any;

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationWindowComponent implements OnInit {
  private static NAME: string = 'dialog';
  position = {lat: 0, lng: 0, address: ''};
  error: string;
  private scriptLoadingPromise: Promise<void>;
  @Output() onSaved = new EventEmitter<Object>();

  constructor(private notifier: NotifierController, private dialog: DialogController) {
    notifier.pageChanged$.subscribe(action => {
      if (action == LocationWindowComponent.NAME) {
        this.onSaved.emit('');
      }
    });
    notifier.notify(LocationWindowComponent.NAME);
    dialog.errorResponse$.subscribe(tryAgain => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.load().then(() => {
      const loc = this;
      const map = new google.maps.Map(document.getElementById('location'), {
        center: {lat: 48.211029, lng: 16.373990},
        zoom: 14,
        styles: mapconfig.style
      });
      let input = document.getElementById('search-input');
      let searchBox = new google.maps.places.SearchBox(input);
      map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
      });
      searchBox.addListener('places_changed', function () {
        let places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        let bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          if (!place.geometry) {
            return;
          }
          marker.setPosition(place.geometry.location);
          loc.position.lng = marker.getPosition().lng();
          loc.position.lat = marker.getPosition().lat();
          loc.position.address = place.formatted_address;
          // Create a marker for each place.

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
      let geocoder = new google.maps.Geocoder;
      map.addListener('click', function (e) {
        marker.setPosition(e.latLng);
        geocoder.geocode({'location': marker.getPosition()}, function (results, status) {
          if (status === 'OK') {
            if (results[1]) {
              loc.position.lng = marker.getPosition().lng();
              loc.position.lat = marker.getPosition().lat();
              loc.position.address = results[0].formatted_address;
              document.getElementById('search-input').nodeValue = results[0].formatted_address;
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      });
      let icon = {
        url: "assets/pin.png", // url
        scaledSize: new google.maps.Size(30, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      let marker = new google.maps.Marker({
        title: 'Service location',
        map: map,
        icon: icon
      });
    }).catch(error => {
      this.dialog.notifyError('No internet connection');
    });
  }


  private load(): Promise<void> {
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;

    const callbackName = 'initAutocomplete';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCvn27CPRnDIm_ROE-Q8U-x2pUYep7yCmU&libraries=places&callback=&callback=' + callbackName;

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

  public saveLocation() {
    if (this.position.lng != 0) {
      let t = {coordinate: {lat: 0, lng: 0}, address: ''};
      t.coordinate.lng = this.position.lng;
      t.coordinate.lat = this.position.lat;
      t.address = this.position.address;
      this.onSaved.emit(t);
    } else {
      this.error = 'Select your service location!'
    }
  }

}
