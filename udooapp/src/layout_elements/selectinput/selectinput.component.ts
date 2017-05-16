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
  valueText: number = -1;
  data: any[] = [];
  isOption: boolean = false;
  @Input() disabled = false;
  @Input() disableValidation = false;
  @Output() text = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onStateChange = new EventEmitter<boolean>();

  constructor() {
  }

  focusChange() {
    this.valid();
  }

  @Input() set options(options: any[]) {
    this.data = options;
    this.isOption = true;
  }

  @Input() set values(options: any[]) {
    this.data = options;
  }


  valid() {
    if (this.valueText < 0 || this.valueText > this.options.length) {
      this.error = true;
      this.ok = false;
    } else {
      this.error = false;
      this.ok = true;
      this.show = false;
    }
    this.onStateChange.emit(this.ok);
  }

  onKey(event: any) {
    console.log(event.target.value);
    this.notChange = true;
    this.valueText = event.target.value;
    this.text.emit(event.target.value);
    if (this.error && !this.disableValidation) {
      this.valid();
    }
  }

  onClickInputBox() {
    this.onClickInput.emit(true);
  }

  showInfo() {
    this.show = !this.show;
    if (this.errorMessage.length == 0 && !this.disableValidation) {
      this.valid()
    }
  }
}
