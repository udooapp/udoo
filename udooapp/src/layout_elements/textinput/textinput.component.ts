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
  @Input() type: string;
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() validators: IValidator[];
  @Output() text = new EventEmitter<String>();
  @Output() onKeyEvent = new EventEmitter<any>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onStateChange = new EventEmitter<boolean>();


  constructor() {
    this.type = 'text';
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
          this.errorMessage = this.validators[i].getText();
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
    this.onStateChange.emit(this.ok);
  }

  @Input() set checkValidate(value: boolean){
    if(value != this.refresh){
      this.refresh = value;
      this.valid()
    }
  }

  onKey(event: any) {
    this.notChange = true;
    this.inputText = event.target.value;
    this.text.emit(event.target.value);
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
