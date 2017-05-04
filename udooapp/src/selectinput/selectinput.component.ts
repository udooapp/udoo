import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'select-input',
  templateUrl: './selectinput.component.html',
  styleUrls: ['./selectinput.component.css', '../inputfield.css']
})
export class SelectInputComponent {
  error = false;
  ok = false;
  show = false;
  notChange = false;
  errorMessage = 'Invalid value';
  valueText: number = 0;
  @Input() options: string[] = [];
  @Input() disabled = false;
  @Output() text = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();

  constructor() {
  }

  focusChange() {
    this.valid();
  }

  valid() {
      if(this.valueText < 0 || this.valueText > this.options.length){
        this.error = true;
        this.ok = false;
      } else {
        this.error = false;
        this.ok = true;
        this.show = false;
      }
  }

  onKey(event: any) {
    this.notChange = true;
    this.valueText = event.target.value;
    this.text.emit(event.target.value);
    if (this.error) {
      this.valid();
    }
  }

  onClickInputBox() {
    this.onClickInput.emit(true);
  }

  showInfo() {
    this.show = !this.show;
    if (this.errorMessage.length == 0) {
      this.valid()
    }
  }
}
