import {EventEmitter} from "@angular/core";
import {User} from "../entity/user";
import {Router} from "@angular/router";
import {config} from "../environments/url.config";

declare let navigator;

export class NotifierController {
  public static LANGUAGE_GERMAN: number = 0;
  public static LANGUAGE_ENGLISH: number = 1;
  public static REFRESH_USER_DATA: number = 4;

  private user: User;
  private pageList: string[] = [];
  public pageChanged$: EventEmitter<string>;
  public notification$: EventEmitter<number>;

  public userModification$: EventEmitter<number>;
  public userDataPipe$: EventEmitter<User>;
  public userScrolledToTheBottom$: EventEmitter<boolean>;
  public userLogOut$: EventEmitter<boolean>;
  private route: string = '';
  private router: Router;


  constructor() {
    this.pageChanged$ = new EventEmitter();
    this.userModification$ = new EventEmitter();
    this.userDataPipe$ = new EventEmitter();
    this.userScrolledToTheBottom$ = new EventEmitter();
    this.userLogOut$ = new EventEmitter();
    this.notification$ = new EventEmitter();
  }

  public sendVerification() {
    this.userModification$.emit(-1);
  }

  public sendUserModification(modification: number) {
    this.userModification$.emit(modification)
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

  public setUser(user: User) {
    this.user = user;
  }

  public getUser(): User {
    let us: User = this.user;
    this.user = null;
    return us;
  }

  public refreshMainData() {
    this.pageChanged$.emit('refresh');
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
