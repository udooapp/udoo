import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {TokenService} from "../services/token.service";
import {getTranslationProviders} from "../localization/i18n-providers";
import {DialogController} from "./dialog.controller";
import {NotifierController} from "./notify.controller";
import {ROUTES} from "../app/app.routing";

@Injectable()
export class UserController {

  public static LANGUAGE_GERMAN: number = 0;
  public static LANGUAGE_ENGLISH: number = 1;
  public static REFRESH_USER_DATA: number = 4;

  public userNotification$: EventEmitter<number>;
  public userDataPipe$: EventEmitter<any>;
  public logoutDataPipe$: EventEmitter<any>;
  public checkLogin: boolean = false;
  private lastUpdate: number = -1;
  private data: any;

  constructor(private dialog: DialogController, private notifier: NotifierController, private userService: UserService, private tokenService: TokenService, private router: Router) {
    this.userDataPipe$ = new EventEmitter();
    let before: string = '';
    router.events.subscribe((event) => {
      if (event.url === ROUTES.MAIN && (before === ROUTES.LOGIN )) {
        this.checkLogin = event.url === ROUTES.MAIN && before === ROUTES.LOGIN;
        this.refreshUser();
      } else {
        this.checkLogin = false;
      }
      if (event instanceof NavigationEnd) {
        before = event.url;
      }
    });
    dialog.invalidToken$.subscribe(value => {
      if (value) {
        this.tokenService.clearToken();
        this.router.navigate([ROUTES.LOGIN]);
        this.userDataPipe$.emit(null);
      }
    });
    this.userNotification$ = new EventEmitter();
    this.logoutDataPipe$ = new EventEmitter();
  }

  public logOut() {
    this.userService.logout().subscribe(
      () => {
        this.router.navigate([ROUTES.MAIN]);
        this.tokenService.clearToken();
        this.notifier.systemNotification$.emit([]);
        this.userNotification$.emit(0);
        this.logoutDataPipe$.emit(null);
      },
      error => {
        console.log('Log out error');
        this.logoutDataPipe$.emit(error);
        this.dialog.notifyError(error);
      }
    );
  }

  public forceRefreshUser() {
    if (this.tokenService.getToken()) {
      this.getData();
    } else {
      this.userDataPipe$.emit(null);
    }
  }

  private getData() {
    this.userService.getUserData().subscribe(
      data => {
        this.data = data;
        this.lastUpdate = new Date().getTime();
        //   window.document =this.user.language;
        document['locale'] = data.user.language;
        getTranslationProviders().then(() => {
        }).catch(() => {
        });

        let activated = data.user.active >= 15;
        if (!activated && this.checkLogin) {
          this.router.navigate([ROUTES.CREATE]);
        }

        this.userDataPipe$.emit(data);
        if (data.systemNotification) {
          this.notifier.systemNotification$.emit(data.systemNotification);
        } else {
          this.notifier.systemNotification$.emit([]);
        }
        this.userNotification$.emit(data.notifications.length);
        if (data.notifications != null && data.notifications.length > 0) {

        }
        if (data.reminders != null && data.reminders.length > 0) {
          this.notifier.sendReminderNotification(this.router, ROUTES.REQUEST_LIST, data.reminders);
        }
      },
      error => {
        this.dialog.notifyError(error);
        this.userDataPipe$.emit(null);
      });
  }

  public refreshUser() {
    if (this.tokenService.getToken()) {
      if (this.lastUpdate == -1 || (new Date().getTime() - this.lastUpdate) / 1000 > 2) {
        this.getData();
      } else {
        this.userDataPipe$.emit(this.data);
      }
    } else {
      this.userDataPipe$.emit(null);
    }
  }

  public sendUserModification(verify: number) {
    if (verify == UserController.LANGUAGE_ENGLISH || verify == UserController.LANGUAGE_GERMAN) {
      // this.user.language = verify === 0 ? 'en' : 'de';
      // document['locale'] = this.user.language;
      // getTranslationProviders().then(value => {
      // }).catch(err => {
      // });

    } else if (verify == UserController.REFRESH_USER_DATA) {
      this.refreshUser();
    }
  }

}
