import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'file-input',
  templateUrl: './fileinput.component.html',
  styleUrls: ['./fileinput.component.css']
})
export class FileInputComponent {

  @Input() text = 'Browse';
  @Input() dark = true;
  @Output() value = new EventEmitter<any>();

  constructor() {
  }

  onClickBrowse(event){
    this.value.emit(event);
  }
}
