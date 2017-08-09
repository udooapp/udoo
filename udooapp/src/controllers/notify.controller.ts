import {EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {config} from "../environments/url.config";

declare let navigator;

export class NotifierController {

  private pageList: string[] = [];
  public pageChanged$: EventEmitter<string>;
  public notification$: EventEmitter<number>;
  public systemNotification$: EventEmitter<any>;

  public userScrolledToTheBottom$: EventEmitter<boolean>;
  private route: string = '';
  private router: Router;


  constructor() {
    this.pageChanged$ = new EventEmitter();
    this.userScrolledToTheBottom$ = new EventEmitter();
    this.notification$ = new EventEmitter();
    this.systemNotification$ = new EventEmitter();
  }



  public back(): string {
    if (this.pageList.length > 0) {
      let action: string = this.pageList.pop();
      this.pageChanged$.emit(action);
      return action;
    }
    return null;
  }

  private onConfirm() {
    if (this.router != null) {
      this.router.navigate([this.route]);
    }
  }

  sendReminderNotification(router: Router, route: string, data: any[]) {
    if (navigator != null && config.mobile) {
      this.route = route;
      this.router = router;
      for (let i = 0; i < data.length; ++i)
        navigator.notification.confirm(
          data[i].message,  // message
          this.onConfirm,              // callback to invoke with index of button pressed
          data[i].title,            // title
          ''          // buttonLabels
        );
    }
  }

  public isEmpty(): boolean {
    return this.pageList.length == 0;
  }

  public notify(action: string) {
    let pageListLength = this.pageList.length;
    if ((pageListLength > 0 && this.pageList[pageListLength - 1] !== action) || pageListLength === 0) {
      this.pageList.push(action);
      this.pageChanged$.emit(action + "New");
    }
  }

  public clear() {
    this.pageList = [];
  }
}
