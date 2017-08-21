import {AfterViewChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../entity/user";
import {TokenService} from "../../services/token.service";
import {NotifierController} from "../../controllers/notify.controller";
import {MAIN} from "../../app/app.routing.module";
import {EmailService} from "../../services/email.service";
import {document} from "@angular/platform-browser/src/facade/browser";
import {DialogController} from "../../controllers/dialog.controller";
import {BidService} from "../../services/bid.service";
import {MenuController} from "../../controllers/menu.controller";
import {UserController} from "../../controllers/user.controller";

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
  notifications = {bids: 0, request: 0, offer: 0, chat: 0};
  login: boolean = false;
  image: string = '';
  menuLoaded: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  private swipeAttached: boolean = false;
  public disableSwipe: boolean = false;

  constructor(private userController: UserController, private router: Router, private tokenService: TokenService, private menuController: MenuController) {

    menuController.disableMenuSwipe$.subscribe(value => {
      this.disableSwipe = value;
    });
    userController.logoutDataPipe$.subscribe(message => {
      if (message == null) {
        this.login = false;
        if (this.user.socialID) {
          FB.logout(function (response) {
          });
        }
        this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
        this.router.navigate([MAIN]);
        this.tokenService.clearToken();
        this.notifications = {bids: 0, request: 0, offer: 0, chat: 0};
      } else {
        console.log("Error:" + message);
      }
    });
    userController.userDataPipe$.subscribe(data => {
      if (data != null) {
        this.user = data.user;
        this.login = true;

        this.user = data.user;
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

        this.activated = data.user.active >= 15;
        this.activatedUser.emit(this.activated);
        this.notifications.bids = 0;
        this.notifications.offer = 0;
        this.notifications.request = 0;
        this.notifications.chat = 0;

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
              case 3:
                ++this.notifications.chat;
                break;
            }
          }
        }
      }
      else {
        this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
        this.login = false;
        this.image = this.getPictureUrl('');
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
    this.userController.refreshUser();
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
    this.userController.logOut();
  }
}
