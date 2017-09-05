import {Component, EventEmitter, Input, Output} from '@angular/core';
import {config} from "../../environments/url.config";

declare let Camera: any;
declare let navigator: any;

@Component({
  selector: 'file-input',
  templateUrl: './fileinput.component.html',
  styleUrls: ['./fileinput.component.css']
})
export class FileInputFieldComponent {


  @Input() text = 'Browse';
  @Input() dark = true;
  @Output() value = new EventEmitter<any>();
  @Input() camera: boolean = false;
  @Output() valueTake = new EventEmitter<string>();
  constructor() {
  }

  public onClickTake(){
    if (config.mobile && this.camera) {
      let valueTake = this.valueTake;
      navigator.camera.getPicture(
        imageData => {
          valueTake.emit("data:image/jpeg;base64," + imageData);
        },
        event => {
          alert('Failed because: ' + event);
        }, {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL
        });
    }
  }
  public onClickBrowse(event){
    this.value.emit(event);
  }
}
