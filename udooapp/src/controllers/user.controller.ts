import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {TokenService} from "../services/token.service";
import {getTranslationProviders} from "../localization/i18n-providers";
import {CREATE, LOGIN, MAP, REQUEST_LIST} from "../app/app.routing.module";
import {DialogController} from "./dialog.controller";
import {NotifierController} from "./notify.controller";

@Injectable()
export class UserController {

  public static LANGUAGE_GERMAN: number = 0;
  public static LANGUAGE_ENGLISH: number = 1;
  public static REFRESH_USER_DATA: number = 4;

  public userNotification$: EventEmitter<number>;
  public userDataPipe$: EventEmitter<any>;
  public logoutDataPipe$: EventEmitter<any>;
  public checkLogin: boolean = false;


  constructor(private dialog: DialogController, private notifier: NotifierController, private userService: UserService, private tokenService: TokenService, private router: Router) {
    this.userDataPipe$ = new EventEmitter();
    let before: string = '';
    router.events.subscribe((event) => {
      if (event.url === MAP && (before === LOGIN )) {
        this.checkLogin = event.url === MAP && before === LOGIN;
        this.refreshUser();
      } else {
        this.checkLogin = false;
      }
      if (event instanceof NavigationEnd) {
        before = event.url;
      }
    });


    dialog.mainRefresh$.subscribe(token => {
      if (token) {
        this.tokenService.clearToken();
        this.router.navigate([LOGIN]);
        this.userDataPipe$.emit(null);
      } else {
        console.log('RefreshUserMainRefresh');
        this.refreshUser();
      }
    });
    this.userNotification$ = new EventEmitter();
    this.logoutDataPipe$ = new EventEmitter();
  }

  public logOut() {
    this.userService.logout().subscribe(
      () => {
        this.router.navigate([MAP]);
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

  public refreshUser() {
    if (this.tokenService.getToken()) {
      this.userService.getUserData().subscribe(
        data => {
          //   window.document =this.user.language;
          document['locale'] = data.user.language;
          getTranslationProviders().then(() => {
          }).catch(() => {
          });

          let activated = data.user.active >= 15;
          if (!activated && this.checkLogin) {
            this.router.navigate([CREATE]);
          }

          this.userDataPipe$.emit(data);
          if (data.systemNotification) {
            this.notifier.systemNotification$.emit(data.systemNotification);
          }
          this.userNotification$.emit(data.notifications.length);
          if (data.notifications != null && data.notifications.length > 0) {

          }
          if (data.reminders != null && data.reminders.length > 0) {
            this.notifier.sendReminderNotification(this.router, REQUEST_LIST, data.reminders);
          }
        },
        error => {
          this.dialog.notifyError(error);
          this.userDataPipe$.emit(null);
        });
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
      console.log('RefreshUserModificationa');
      this.refreshUser();
    }
  }

}
