import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ValidationComponent} from "./validation.component";
import formatErrorMsg = jasmine.formatErrorMsg;


@Component({
  selector: 'text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  error = false;
  ok = false;
  show = false;
  errorMessage = '';
  id: number;
  @Input() value: string;
  @Input() type: string;
  @Input() placeholder: string;
  @Input() validation: ValidationComponent;
  @Output() text = new EventEmitter<String>();
  private inputText = '';

  constructor() {
    this.type = 'text';
    this.placeholder = 'value';
    this.value = '';
    this.id = -1;
  }

  focusChange() {
    this.valid();
  }

  valid() {
    if (this.validation != null) {
      if (this.id == -1) {
        this.id = this.validation.add();
      }
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

  @Input() set refresh(refresh: number){
    if (this.id == -1) {
      this.id = this.validation.add();
    }
    if(refresh > -1 && refresh == this.id) {
      this.valid();
    }
  }
  onKey(event: any) {
    this.inputText = event.target.value;
    this.text.emit(event.target.value);
    if (this.error) {
      this.valid();
    }
  }

  showInfo() {
    this.show = !this.show;
    if (this.errorMessage.length == 0) {
      this.valid()
    }
  }
}
