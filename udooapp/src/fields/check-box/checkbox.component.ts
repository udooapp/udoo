import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {
  public checkboxValue: Boolean = false;
  private valueChange: boolean = false;
  @Output() change = new EventEmitter<Boolean>();

  @Input()
  set value(value: any) {
    if(!this.valueChange && value != null && value instanceof Boolean) {
      this.checkboxValue = value;
    } else {
      this.valueChange = false;
    }
  }

  constructor() {

  }

  public onChangeCheckBox() {
    this.valueChange = true;
    this.change.emit(this.checkboxValue);
  }
}
