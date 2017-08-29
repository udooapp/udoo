import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityFieldComponent {
  public data: any[] = [[], [], [], [], [], [], []];
  public hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  public errorIndex: boolean[][] = [];

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
        for (let i = 0; i < this.data.length; ++i) {
          for (let j = 0; j < this.data[i].length; ++j) {
            this.errorIndex[i].push(false);
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
      this.errorIndex.push([]);
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

  public onChangeSelect(event, row: number, col: number, from: boolean) {
    if (from) {
      this.data[row][col].from = +event.target.value;
    } else {
      this.data[row][col].to = +event.target.value;
    }
    if (this.editable) {
      if (!this.validate(row, col)) {
        this.validation.emit(false);
        this.errorIndex[row][col] = true;
      } else {
        this.availability.emit(this.data);
        this.errorIndex[row][col] = false;
        this.validation.emit(this.checkError());
      }
    }
  }

  public checkError(): boolean {
    let count: number = 0;
    for (let i = 0; i < this.errorIndex.length; ++i) {
      for (let j = 0; j < this.errorIndex[i].length; ++j) {
        if (this.errorIndex[i][j]) {
          return false;
        }
        ++count;
      }
    }
    if (this.disableValidate > 0 || this.disableValidate == -1) {
      return count != 0;
    } else {
      return true;
    }
  }

  public onClickRemove(dataIndex: number, index: number) {
    this.data[dataIndex].splice(index, 1);
    this.errorIndex[dataIndex].splice(index, 1);
  }

  public onClickAddButton(index: number) {
    this.data[index].push({from: 0, to: 0});
    this.validation.emit(false);
    this.errorIndex[index].push(true);
  }

  private validate(row: any, col: any): boolean {
    let data = this.data[row][col];
    if (this.compareHours(data.from, data.to) < 1) {
      return false;
    }
    for (let i = 0; i < this.data[row].length; ++i) {
      if (i != col) {
        let comp = this.data[row][i];
        if (data.from >= comp.from && data.from < comp.to) {
          return false;
        } else if (data.to > comp.from && data.to <= comp.to) {
          return false;
        } else if (data.from <= comp.from && data.to >= comp.to) {
          return false;
        }
      }
    }
    return true;
  }

  private compareHours(hour1: number, hour2: number): number {
    if (hour1 < hour2) {
      return 1
    } else if (hour1 == hour2) {
      return 0;
    }
    return -1;
  }


}
