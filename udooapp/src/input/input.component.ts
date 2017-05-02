import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ValidationComponent} from "./validation.component";
import formatErrorMsg = jasmine.formatErrorMsg;
import {type} from "os";


@Component({
  selector: 'text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  error = false;
  ok = false;
  show = false;
  notChange = false;
  errorMessage = '';
  id = -1;
  valueText = '';
  inputText = '';
  @Input() type: string;
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() validation: ValidationComponent;
  @Output() text = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();


  constructor() {
    this.type = 'text';
    this.placeholder = 'value';
  }

  focusChange() {
    this.valid();
  }

  @Input() set value(value: string) {
    if (!this.notChange) {
      this.valueText = value;
      this.inputText = value;
      if (value.length > 0 && this.id > -1) {
        this.valid();
      }
    } else {
      this.notChange = false;
    }
  }

  valid() {
    if (this.validation != null) {
      this.errorMessage = this.validation.checkInputValidation(this.id, this.inputText, this.type);
      if (this.errorMessage.length == 0) {
        this.ok = true;
        this.error = false;
      } else {
        this.error = true;
        this.ok = false;
      }
    }
  }

  @Input() set refresh(refresh: number) {
    if (this.id == -1) {
      this.id = this.validation.add();
      if(this.valueText.length > 0){
        this.valid();
      }
    }
    if (refresh > -1 && refresh == this.id) {
      this.valid();
    }
  }

  onKey(event: any) {
    this.notChange = true;
    this.inputText = event.target.value;
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
