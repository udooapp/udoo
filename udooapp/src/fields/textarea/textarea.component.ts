import {Component, EventEmitter, Input, Output} from '@angular/core';
import formatErrorMsg = jasmine.formatErrorMsg;
import {IValidator} from "../../validator/validator.interface";


@Component({
  selector: 'text-area',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css', '../inputfield.css']
})
export class TextAreaComponent {
  error = false;
  ok = false;
  show = false;
  notChange = false;
  errorMessage = '';
  valueText = '';
  remove: boolean = false;
  inputText = '';
  refresh: boolean = false;
  @Input() id = '';
  @Input() row: number;
  @Input() column: number;
  @Input() type: string;
  @Input() disabled = false;
  @Input() disableValidation = false;
  @Input() placeholder: string;
  @Input() validators: IValidator[];
  @Output() onKey = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onValidationStateChange = new EventEmitter<boolean>();
  @Output() onEnterPressed = new EventEmitter<boolean>();

  constructor() {
    this.type = 'onKey';
    this.placeholder = 'value';
    this.row = 5;
    this.column = 10;
  }

  focusChange() {
    this.valid();
  }

  @Input() set checkValidate(value: boolean) {
    if (value != this.refresh) {
      this.refresh = value;
      this.valid()
    }
  }
  @Input() set clear(clear: boolean){
    console.log('clearArea: ' + clear);
    this.remove = clear;
      this.valueText = null;
      this.inputText = null;
    console.log('input: ' + this.valueText);
  }
  @Input() set value(value: string) {
    if(value != null) {
      if (!this.notChange) {
        this.valueText = value;
        this.inputText = value;
        if (value.length > 0) {
          this.valid();
        }
      } else {
        this.notChange = false;
      }
    }
  }

  valid() {
    if(!this.disableValidation) {
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
  }

  onKeyInput(event: any) {
    this.notChange = true;
    this.inputText = event.target.value;
    this.onKey.emit(event.target.value);
    if (this.error) {
      this.valid();
    }
    if(event.which == 13){
      this.onEnterPressed.emit(true);
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
