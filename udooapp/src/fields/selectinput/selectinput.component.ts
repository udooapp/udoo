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
  refresh : boolean = false;
  notChange = false;
  errorMessage = 'Invalid value';
  valueText: number = -1;
  data: any[] = [];
  isOption: boolean = false;
  @Input() disabled = false;
  @Input() id = '';
  @Input() selected : number = 0;
  @Input() disableValidation = false;
  @Output() onChange = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onValidationStateChange = new EventEmitter<boolean>();

  constructor() {
  }

  focusChange() {
    if(!this.disableValidation) {
      this.valid();
    }
  }

  @Input() set checkValidate(value: boolean) {
    if (value != this.refresh && !this.disableValidation) {
      this.refresh = value;
      this.valid()
    }
  }


  @Input() set options(options: any[]) {
    this.data = options;
    this.isOption = true;
  }

  @Input() set values(options: any[]) {
    this.data = options;
  }


  valid() {
    if (this.valueText < 0 || this.valueText > this.data.length) {
      this.error = true;
      this.ok = false;
    } else {
      this.error = false;
      this.ok = true;
      this.show = false;
    }
    this.onValidationStateChange.emit(this.ok);
  }

  onKey(event: any) {
    this.notChange = true;
    this.valueText = event.target.value;
    console.log(this.valueText);
    this.onChange.emit(event.target.value);
    if (!this.disableValidation) {
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
