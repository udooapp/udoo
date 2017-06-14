import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IValidator} from "../../validator/validator.interface";


@Component({
  selector: 'text-input',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.css', '../inputfield.css']
})
export class TextInputComponent {
  error = false;
  ok = false;
  show = false;
  notChange = false;
  refresh : boolean = false;
  errorMessage = '';
  valueText = '';
  inputText = '';
  @Input() disableValidation = false;
  @Input() id: string = '';
  @Input() type: string;
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() validators: IValidator[];
  @Output() onKey = new EventEmitter<String>();
  @Output() onKeyEvent = new EventEmitter<any>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onValidationStateChange = new EventEmitter<boolean>();


  constructor() {
    this.type = 'onKey';
    this.placeholder = 'value';
  }

  focusChange() {
    this.valid();
  }

  @Input() set value(value: string) {
    if (!this.notChange) {
      if (value == null) {
        value = '';
      }
      this.valueText = value;
      this.inputText = value;

      if (value.length > 0 && !this.disableValidation) {
        this.valid();
      }
    } else {
      this.notChange = false;
    }
  }

  valid() {
    if (this.validators == null || this.validators.length == 0) {
      this.error = false;
      this.show = false;
      this.ok = true;
    } else {
      this.error = false;
      for (let i = 0; i < this.validators.length; ++i) {
        if (!this.validators[i].validate(this.inputText)) {
          this.error = true;
          this.errorMessage = this.validators[i].getErrorMessage();
          break;
        }
      }
      if (!this.error) {
        this.show = false;
        this.ok = true;
      } else {
        this.ok = false;
      }
    }
    this.onValidationStateChange.emit(this.ok);
  }

  @Input() set checkValidate(value: boolean){
    if(value != this.refresh){
      this.refresh = value;
      this.valid()
    }
  }

  onKeyInput(event: any) {
    this.notChange = true;
    this.inputText = event.target.value;
    this.onKey.emit(event.target.value);
    this.onKeyEvent.emit(event);
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
