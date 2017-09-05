import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityFieldComponent {
  public data: any[] = [{from: 8, to: 17}, {from: 8, to: 17}, {from: 8, to: 17}, {from: 8, to: 17}, {from: 8, to: 17}, {from: -1, to: -1}, {from: -1, to: -1}];
  public hoursIndex: number[] = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  public hoursName: any[] = ['CLOSED', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  public errorIndex: boolean[] = [];

  private isUpdate: boolean = false;
  private disableValidate: number = -1;

  @Output()
  public availability = new EventEmitter<any>();

  @Output()
  public validation = new EventEmitter<boolean>();

  @Input()
  public editable: boolean = false;

  @Input()
  public set checkValidate(value: boolean) {
    ++this.disableValidate;
    this.validation.emit(this.checkError());
  }

  @Input()
  public set value(value: any) {
    if (value != null && value.length == 7) {
      if (!this.isUpdate) {
        this.data = value;
        for(let i = 0; i < this.data.length; ++i){
          if(this.data[i].from != -1 && this.data[i].from >= this.data[i].to){
            this.errorIndex[i] = true;
          }
        }
      } else {
        this.isUpdate = false;
      }
    } else {
      this.validation.emit(false);
    }

  }

  constructor() {
    for (let i = 0; i < 7; ++i) {
      this.errorIndex.push(false);
    }
  }

  public getDayName(index: number): string {
    switch (index) {
      case 0:
        return 'Monday';
      case 1:
        return 'Tuesday';
      case 2:
        return 'Wednesday';
      case 3:
        return 'Thursday';
      case 4:
        return 'Friday';
      case 5:
        return 'Saturday';
      case 6:
        return 'Sunday';
    }
  }

  public onChangeSelect(event, row: number, from: boolean) {
    if (from) {
      this.data[row].from = +event.target.value;
    } else {
      this.data[row].to = +event.target.value;
    }
    if (this.editable) {
      if (!this.validate(row, )) {
        this.validation.emit(false);
        this.errorIndex[row] = true;
      } else {
        this.availability.emit(this.data);
        this.errorIndex[row] = false;
        this.validation.emit(this.checkError());
      }
    }
  }

  public checkError(): boolean {
    let count: number = 0;
    for (let i = 0; i < this.errorIndex.length; ++i) {
        if (this.errorIndex[i]) {
          return false;
        }
        ++count;
    }
    if (this.disableValidate > 0 || this.disableValidate == -1) {
      return count != 0;
    } else {
      return true;
    }
  }

  private validate(row: any): boolean {
    let data = this.data[row];
    if (this.compareHours(data.from, data.to) < 1) {
      return false;
    }
    return true;
  }

  private compareHours(hour1: number, hour2: number): number {
    if(hour1 == -1){
      return 1;
    }
    if (hour1 < hour2) {
      return 1
    } else if (hour1 == hour2) {
      return 0;
    }
    return -1;
  }


}
