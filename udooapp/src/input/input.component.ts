import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Validators} from "@angular/forms";


@Component({
  selector: 'text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  error = false;
  errorMessage = '';
  ok = false;
  show = false;
  @Input() value: string;
  @Input() type: string;
  @Input() placeholder: string;
  @Output() text = new EventEmitter<String>();
  private inputText = '';

  constructor() {
    this.type = 'text';
    this.placeholder = 'value';
    this.value = '';
  }

  focusChange() {
    this.valid();
  }

  valid() {
    switch (this.type) {
      case 'password':
        if (Validators.minLength(5)) {
          this.error = true;
          this.ok = false;
          this.errorMessage = 'To short';
        } else {
          this.show = false;
          this.error = false;
          this.ok = true;
          this.errorMessage = '';
        }
        break;
      case 'email':
        let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!re.test(this.inputText) || this.inputText.length < 10) {
          this.error = true;
          this.show = false;
          this.ok = false;
          this.errorMessage = 'Most be contain \'@\' and \'.\'';
        } else {
          this.error = false;
          this.ok = true;
          this.errorMessage = '';
        }
        break;
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
  }
}
