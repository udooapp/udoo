import {AfterViewChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../entity/user";
import {TokenService} from "../../services/token.service";
import {NotifierController} from "../../controllers/notify.controller";
import {CREATE, LOGIN, MAP, REQUEST_LIST} from "../../app/app.routing.module";
import {EmailService} from "../../services/email.service";
import {document} from "@angular/platform-browser/src/facade/browser";
import {getTranslationProviders} from "../../localization/i18n-providers";
import {DialogController} from "../../controllers/dialog.controller";
import {BidService} from "../../services/bid.service";
import {MenuController} from "../../controllers/menu.controller";

declare let FB;

@Component({
  selector: 'side-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [UserService, EmailService, BidService]
})

export class MenuComponent implements OnInit, AfterViewChecked {
  activated: boolean = false;
  @Output() activatedUser = new EventEmitter<boolean>();
  @Output() menuItemClicked = new EventEmitter<boolean>();
  visibleMenu: number = -1;
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
  notifications = {bids: 0, request: 0, offer: 0};
  login: boolean = false;
  image: string = '';
  menuLoaded: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  checkLogin: boolean = false;
  private swipeAttached: boolean = false;
  public disableSwipe: boolean = false;

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private notifier: NotifierController, private dialog: DialogController, private menuController: MenuController) {
    let before: string = '';
    menuController.disableMenuSwipe$.subscribe(value => {
      this.disableSwipe = value;
    });
    notifier.pageChanged$.subscribe(action => {
      if (action === 'refresh') {
        this.checkUser(false);
      }
    });
    router.events.subscribe((event) => {
      if (event.url === MAP && (before === LOGIN || before === '')) {
        this.checkLogin = event.url === MAP && before === LOGIN;
        this.checkUser(false);
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
        this.user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
        this.login = false;
      } else {
        this.checkUser(false);
      }
    });
    notifier.userModification$.subscribe(verify => {
      if (verify == NotifierController.LANGUAGE_ENGLISH || verify == NotifierController.LANGUAGE_GERMAN) {
        this.user.language = verify === 0 ? 'en' : 'de';
        // document['locale'] = this.user.language;
        // getTranslationProviders().then(value => {
        // }).catch(err => {
        // });

      } else if (verify == NotifierController.REFRESH_USER_DATA) {
        this.checkUser(true);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (!this.disableSwipe) {
      this.attachSwipeToMenu();
    } else {
      this.swipeAttached = false;
    }
  }

  @Input()
  set showMenu(show: boolean) {
    this.visibleMenu = show ? 1 : this.visibleMenu == -1 ? -1 : 0;
  }

  ngOnInit() {
    this.attachSwipeToMenu();
    this.checkUser(false);
  }

  public attachSwipeToMenu() {
    let t = this;
    let el = document.getElementById('swipe-area');
    if (el != null && !this.swipeAttached) {
      this.swipeAttached = true;
      el.addEventListener('touchstart', function (e) {
        e.preventDefault();
        if (!t.disableSwipe) {
          let touch = e.touches[0];
          t.startX = touch.pageX;
        }
      }, false);
      el.addEventListener('touchend', function (e) {
        e.preventDefault();
        if (!t.disableSwipe) {
          t.currentX = 0;
          t.startX = 0;
          t.menuLoaded = false;
        }
      }, false);
      el.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (!t.disableSwipe) {
          let touch = e.touches[0];
          t.currentX = touch.pageX - t.startX;
          if (Math.abs(t.currentX) >= 10 && !t.menuLoaded) {

            if (t.currentX < 0) {
              t.onClickPlaceHolder();
              t.menuLoaded = true;
            } else if (t.currentX > 0) {
              t.visibleMenu = 1;
              t.menuLoaded = true;
              t.menuItemClicked.emit(false);
            }
          }
        }
      }, false);
    }
  }

  public checkUser(send: boolean) {
    let token = this.tokenService.getToken();
    if (token != null && token.length > 0) {
      this.login = true;
      this.userService.getUserData().subscribe(
        data => {
          this.user = data.user;
          //   window.document =this.user.language;
          document['locale'] = this.user.language;
          getTranslationProviders().then(value => {
          }).catch(err => {
          });
          this.image = this.getPictureUrl(data.user.picture);
          let star = data.user.stars;
          if (star == 0) {
            this.stars = [2, 2, 2, 2, 2];
          } else {
            for (let i = 0; i < 5; ++i) {
              if (star >= 1) {
                this.stars[i] = 2;
              } else if (star > 0) {
                this.stars[i] = 1;
              } else {
                this.stars[i] = 0;
              }
              --star;
            }
          }
          if (send) {
            this.notifier.userDataPipe$.emit(this.user);
          }
          this.activated = data.user.active >= 15;
          this.activatedUser.emit(this.activated);
          if (!this.activated && this.checkLogin) {
            this.router.navigate([CREATE]);
          }
          this.notifications.bids = 0;
          this.notifications.offer = 0;
          this.notifications.request = 0;

          if (data.notifications && data.notifications.length > 0) {
            for (let i = 0; i < data.notifications.length; ++i) {
              switch (data.notifications[i].type) {
                case 0:
                  ++this.notifications.bids;
                  break;
                case 1:
                  ++this.notifications.offer;
                  break;
                case 2:
                  ++this.notifications.request;
                  break;
              }
            }
          }
          if (data.systemNotification) {
            this.notifier.systemNotification$.emit(data.systemNotification);
          }
          this.notifier.notification$.emit(data.notifications.length);
          if (data.notifications != null && data.notifications.length > 0) {

          }
          if (data.reminders != null && data.reminders.length > 0) {
            this.notifier.sendReminderNotification(this.router, REQUEST_LIST, data.reminders);
          }
        },
        error => {
          console.log(error);
          if (error === 'Invalid token') {
            this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
            this.login = false;
            this.image = this.getPictureUrl('');
          }
          this.dialog.notifyError(error);
        });
    } else {
      this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
      this.login = false;
      this.image = this.getPictureUrl('');
    }
  }

  public getPictureUrl(src: string) {
    if (!this.login) {
      return './assets/profile_picture.png';
    } else if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  public clickMenuButton() {
    this.tokenService.clearSearchData();
    this.visibleMenu = 0;
    this.menuItemClicked.emit(true);
  }

  public onClickPlaceHolder() {
    this.visibleMenu = 0;
    this.menuItemClicked.emit(false);
  }

  public logOut() {
    this.visibleMenu = 0;
    this.menuItemClicked.emit(true);
    this.image = this.getPictureUrl('');
    this.activated = false;
    this.activatedUser.emit(true);
    this.userService.logout().subscribe(
      message => {
        this.login = false;
        if (this.user.socialID) {
          FB.logout(function (response) {
          });
        }
        this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
        this.router.navigate([MAP]);
        this.tokenService.clearToken();
        this.notifier.userLogOut$.emit(true);
      },
      error => {
        console.log("Error:" + error);
      }
    );
  }
}
