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

declare let $: any;
declare let FB;
@Component({
  selector: 'side-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [UserService, EmailService]
})

export class MenuComponent implements OnInit {
  activated: boolean = false;
  @Output() activatedUser = new EventEmitter<boolean>();
  @Output() menuItemClicked = new EventEmitter<boolean>();
  visibleMenu: number = -1;
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
  login: boolean = false;
  image: string;
  checkLogin: boolean = false;

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private notifier: NotifierController, private dialog: DialogController) {
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

  ngOnInit() {
    let t = this;
    $("#swipe-area").swipe({
      swipeStatus: function (event, phase, direction, distance, duration, fingers) {
        if (phase == "move" && direction == "right") {
          t.visibleMenu = 1;
          t.menuItemClicked.emit(true);
          return false;
        }
        if (phase == "move" && direction == "left") {
          t.clickMenuButton();
          return false;
        }
      }
    });

    this.checkUser(false);
  }

  public checkUser(send: boolean) {
    let token = this.tokenService.getToken();
    if (token != null && token.length > 0) {
      this.login = true;
      this.userService.getUserData().subscribe(
        user => {
          this.user = user;
          //   window.document =this.user.language;
          document['locale'] = this.user.language;
          getTranslationProviders().then(value => {
          }).catch(err => {
          });
          this.image = this.getPictureUrl(user.picture);
          let star = user.stars;
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
          this.activated = user.active >= 15;
          this.activatedUser.emit(this.activated);
          if (!this.activated && this.checkLogin) {
            this.router.navigate([CREATE]);
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
