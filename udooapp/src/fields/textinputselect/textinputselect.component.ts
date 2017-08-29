import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'text-input-select',
  templateUrl: './textinputselect.component.html',
  styleUrls: ['./textinputselect.component.css']
})
export class TextInputSelectFieldComponent {

  text: String = '';
  @Input() data: any[];
  @Input() placeholder: string;

  @Input() set value(value: string){
    this.text = value;
  }
  @Output() selectedResult: EventEmitter<number>;
  @Output() onKeyEvent: EventEmitter<string>;

  public visible: boolean = false;

  constructor() {
    this.selectedResult = new EventEmitter();
    this.onKeyEvent = new EventEmitter();
  }

  public onClickResult(id) {
    this.visible = false;
    this.selectedResult.emit(id)
  }

  public onClickTextBox() {
    if (!this.visible && this.text.length > 0) {
      this.visible = true;
    }
  }

  public onKey(event) {
    this.visible = event.which != 27;
    this.text = event.target.value;
    this.onKeyEvent.emit(event);
  }
}
