import {EventEmitter} from "@angular/core";

export class MapMainController {
  public setData$: EventEmitter<any>;

  constructor() {
    this.setData$ = new EventEmitter();
  }
}
