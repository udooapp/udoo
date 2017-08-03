import {EventEmitter} from "@angular/core";

export class MenuController {

  public static MENU_ENABLE = false;
  public static MENU_DISABLE = true;

  public disableMenuSwipe$: EventEmitter<boolean>;


  constructor() {
    this.disableMenuSwipe$ = new EventEmitter();
  }
}
