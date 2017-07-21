
import {EventEmitter} from "@angular/core";

export class ListMainController {
  public setData$: EventEmitter<any>;

  constructor() {
    this.setData$ = new EventEmitter();
  }
}
