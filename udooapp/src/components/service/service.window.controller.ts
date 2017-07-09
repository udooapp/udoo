import {EventEmitter} from "@angular/core";

export class ServiceDialogController {
  public loading$: EventEmitter<boolean>;
  public setData$: EventEmitter<any>;

  constructor() {
    this.loading$ = new EventEmitter();
    this.setData$ = new EventEmitter();
  }
}
