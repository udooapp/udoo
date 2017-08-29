import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'select-input',
  templateUrl: './selectinput.component.html',
  styleUrls: ['./selectinput.component.css', '../inputfield.css']
})
export class SelectInputFieldComponent {
  error = false;
  ok = false;
  show = false;
  refresh: boolean = false;
  notChange = false;
  errorMessage = 'Invalid value';
  valueText: number = -1;
  data: any[] = [];
  isOption: boolean = false;
  @Input() disabled = false;
  @Input() id = '';
  @Input() selectd: number = -1;
  @Input() disableValidation = false;
  @Output() onChange = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onValidationStateChange = new EventEmitter<boolean>();

  constructor() {
  }

  @Input() set selected(value: number) {
    this.selectd = value;
    this.valueText = value;
    this.focusChange();
  }

  focusChange() {
    if (!this.disableValidation) {
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
    if(this.selectd > -1){
      this.focusChange();
    }
  }

  @Input() set values(options: any[]) {
    this.data = options;
    if(this.selectd > -1){
      this.focusChange();
    }
  }


  valid() {
    if (this.data.length > 0 && this.selectd > -1) {
      if (this.valueText < 0 || this.valueText > this.data.length) {
        this.error = true;
        this.ok = false;
      } else {
        this.error = false;
        this.ok = true;
        this.show = false;
      }
    }
    this.onValidationStateChange.emit(this.ok);
  }

  onKey(event: any) {
    this.selectd = event.target.value;
    this.notChange = true;
    this.valueText = event.target.value;
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
