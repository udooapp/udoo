import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../entity/user";
import {TokenService} from "../guard/TokenService";
import {NotifierService} from "../services/notify.service";
import {AppRoutingModule} from "./app.routing.module";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit {
  visibleMenu = false;
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '');
  login = false;
  image: string;
  menuButton: boolean = true;
  errorMessage: string = '';
  error = false;
  mainError = false;

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private notifier: NotifierService) {
    let before: string = '';
    router.events.subscribe((event) => {
      if (event.url === '/map' && (before == '/login' || before == '')) {
        this.checkUser();
      }
      if (event instanceof NavigationEnd) {
        before = event.url;
      }
    });
    notifier.pageChanged$.subscribe(action => {

      switch (action) {
        case ' ':
          this.menuButton = true;
          break;
        case 'refresh':
          this.checkUser();
          break;
        default:
          if (action.endsWith('New')) {
            this.menuButton = false;
          }
          break;
      }
    });
    notifier.errorMessage$.subscribe(message => {
      if(message === 'Invalid token'){
        this.tokenService.clearToken();
        this.router.navigate([AppRoutingModule.LOGIN]);
      } else {
        this.errorMessage = message;
        this.error = true;
      }
    });
  }

  ngOnInit() {
    this.checkUser();
  }

  public changeButton() {
    if (!this.menuButton && !this.visibleMenu) {
      this.menuButton = true;
    }
    this.notifier.clear();
  }

  private checkUser() {
    let token = this.tokenService.getToken();
    if (token != null && token.length > 0) {
      this.login = true;
      this.userService.getUserData().subscribe(
        user => {
          this.user = user;
          this.image = this.getPictureUrl(user.picture);
          let star = user.stars;
          for (let i = 0; i < 5; ++i) {
            if (star >= 1) {
              this.stars[i] = 2;
            } else if (star > 0) {
              this.stars[i] = 1;
            } else {
              this.stars[i] = 0;
            }
            star -= 1;
          }
        },
        error => {console.log(error);
          if (error === 'Server error' || error === 'No internet connection' || error === 'Service Unavailable') {
            this.error = true;
            this.errorMessage = error;
            this.mainError = true;
          } else if(error === 'Invalid token'){
            this.tokenService.clearToken();
            this.router.navigate([AppRoutingModule.LOGIN]);
          }
        });
    } else {
      this.user = new User(null, '', '', '', '', '', 0, 0, '');
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

  public onClickMenu() {
    if (!this.menuButton && !this.visibleMenu) {
      this.notifier.back();
      if (this.notifier.isEmpty()) {
        this.menuButton = true;
      }

    } else {
      this.visibleMenu = !this.visibleMenu;
      this.menuButton = !this.menuButton;
    }
  }

  public clickMenuButton() {
    this.visibleMenu = false;
    this.menuButton = true;
  }

  public logOut() {
    this.visibleMenu = !this.visibleMenu;
    this.menuButton = true;
    this.image = this.getPictureUrl('');
    this.userService.logout().subscribe(
      message => {
        this.login = false;
        this.user = new User(null, '', '', '', '', '', 0, 0, '');
        this.router.navigate([AppRoutingModule.MAP]);
        this.tokenService.clearToken()
      },
      error => {
        //this.tokenService.clearToken();
        console.log("Error:" + error);
      }
    );
  }

  public onClickTryAgain() {
    this.error = false;
    this.notifier.tryAgain();
    if(this.mainError){
      this.mainError = false;
      this.ngOnInit();
    }
  }
}
