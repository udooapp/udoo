import {EventEmitter} from "@angular/core";

export class MapMainController {
  public setData$: EventEmitter<any>;
  public enableSwipe$: EventEmitter<boolean>;

  constructor() {
    this.setData$ = new EventEmitter();
    this.enableSwipe$ = new EventEmitter();
  }
}
