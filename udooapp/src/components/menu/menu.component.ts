import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../entity/user";
import {TokenService} from "../../services/token.service";
import {NotifierController} from "../../controllers/notify.controller";
import {CREATE, LOGIN, MAP} from "../../app/app.routing.module";
import {EmailService} from "../../services/email.service";
import {document} from "@angular/platform-browser/src/facade/browser";
import {getTranslationProviders} from "../../localization/i18n-providers";
import {DialogController} from "../../controllers/dialog.controller";
import {BidService} from "../../services/bid.service";

declare let FB;
declare let navigator;
@Component({
  selector: 'side-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [UserService, EmailService, BidService]
})

export class MenuComponent implements OnInit {
  activated: boolean = false;
  @Output() activatedUser = new EventEmitter<boolean>();
  @Output() menuItemClicked = new EventEmitter<boolean>();
  visibleMenu: number = -1;
  bids: any[];
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
  login: boolean = false;
  image: string;
  menuLoaded: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  checkLogin: boolean = false;

  constructor(private router: Router, private bidService: BidService, private userService: UserService, private tokenService: TokenService, private notifier: NotifierController, private dialog: DialogController) {
    let before: string = '';
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
      if (verify == 0 || verify == 1) {
        this.user.language = verify === 0 ? 'en' : 'de';
        // document['locale'] = this.user.language;
        // getTranslationProviders().then(value => {
        // }).catch(err => {
        // });
        this.userService.updateUser(this.user).subscribe(
          message => {
          },
          error => {
            if (error === 'Invalid token') {
              this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language, 0, 0);
              this.login = false;
              this.image = this.getPictureUrl('');
            }
            this.dialog.notifyError(error);
          }
        );
      } else if (verify == 4) {
        this.checkUser(true);
      }
    });
  }

  @Input() set showMenu(show: boolean) {
    this.visibleMenu = show ? 1 : this.visibleMenu == -1 ? -1 : 0;
  }

  onConfirm(buttonIndex) {
    if (this.bids != null && this.bids.length > 0) {
      this.bidService.sendPidResponse(this.bids[0].id, buttonIndex == 1).subscribe(data => {
      }, error => {
        this.dialog.notifyError(error);
      });
    }
  }

// Show a custom confirmation dialog
//
  sendNotifications() {
    if(navigator != null) {
      navigator.notification.confirm(
        this.bids[0].message,  // message
        this.onConfirm,              // callback to invoke with index of button pressed
        'Someone sent a bid',            // title
        'Accept,Decline'          // buttonLabels
      );
    }
  }

  ngOnInit() {
    let t = this;
    let el = document.getElementById('swipe-area');
    if (el != null) {
      el.addEventListener('touchstart', function (e) {
        e.preventDefault();
        let touch = e.touches[0];
        t.startX = touch.pageX;

      }, false);
      el.addEventListener('touchend', function (e) {
        e.preventDefault();
        t.currentX = 0;
        t.startX = 0;
        t.menuLoaded = false;
      }, false);
      el.addEventListener('touchmove', function (e) {
        e.preventDefault();
        let touch = e.touches[0];
        t.currentX = touch.pageX - t.startX;
        if (Math.abs(t.currentX) >= 10 && !t.menuLoaded) {

          if (t.currentX < 0) {
            t.menuLoaded = true;
            t.clickMenuButton();
          } else if (t.currentX > 0) {
            t.visibleMenu = 1;
            t.menuLoaded = true;
            t.menuItemClicked.emit(false);
          }
        }
      }, false);
    }
    this.checkUser(false);
  }

  public checkUser(send: boolean) {
    let token = this.tokenService.getToken();
    if (token != null && token.length > 0) {
      this.login = true;
      this.userService.getUserData().subscribe(
        data => {
          this.user = data.user;
          this.bids = data.bids;

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
          if (this.bids != null && this.bids.length > 0) {
            this.sendNotifications();
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
    this.visibleMenu = 0;
    this.menuItemClicked.emit(false);
  }

  public logOut() {
    this.visibleMenu = 0;
    this.menuItemClicked.emit(false);
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


      },
      error => {
        console.log("Error:" + error);
      }
    );
  }
}
