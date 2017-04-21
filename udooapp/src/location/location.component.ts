import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

declare var google: any;

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  position = {lat: 0, lng: 0};
  error: string;
  private scriptLoadingPromise: Promise<void>;
  @Output() onSaved = new EventEmitter<Object>();

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.load().then(() => {
      const loc = this;
      const map = new google.maps.Map(document.getElementById('location'), {
        center: {lat: 48.211029, lng: 16.373990},
        zoom: 14
      });
      map.addListener('click', function (e) {
        marker.setPosition(e.latLng);
        loc.savePosition({lat: marker.getPosition().lat(), lng: marker.getPosition().lng()});
      });
      let marker = new google.maps.Marker({
        title: 'Service location',
        map: map,
      });
      this.position = marker.getPosition();
    });
  }

  savePosition(pos) {
    this.position = pos;
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

  saveLocation() {
    if (this.position != null) {
      this.onSaved.emit(this.position);
    } else {
      this.error = 'Select your service location!'
    }
  }

}
