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
  inputText = '';
  @Input() row: number;
  @Input() column: number;
  @Input() type: string;
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() validators: IValidator[];
  @Output() text = new EventEmitter<String>();
  @Output() onClickInput = new EventEmitter<boolean>();
  @Output() onStateChange = new EventEmitter<boolean>();

  constructor() {
    this.type = 'text';
    this.placeholder = 'value';
    this.row = 5;
    this.column = 10;
  }

  focusChange() {
    this.valid();
  }

  @Input() set value(value: string) {
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

  valid() {
    if(this.validators == null || this.validators.length == 0){
      this.error = false;
      this.show = false;
      this.ok = true;
    }else {
      this.error = false;
      for(let i = 0; i < this.validators.length; ++i){
        if(!this.validators[i].validate(this.inputText)){
          this.error = true;
          this.errorMessage = this.validators[i].getText();
          break;
        }
      }
      if(!this.error){
        this.show = false;
        this.ok = true;
      } else {
        this.ok = false;
      }
    }
    this.onStateChange.emit(this.ok);
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
