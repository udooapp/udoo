import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../entity/user";
import {TokenService} from "../guard/TokenService";
import {NotifierService} from "../services/notify.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, TokenService]
})

export class AppComponent implements OnInit {
  visibleMenu = false;
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '');
  login = false;
  image: string;
  private menuButton: boolean = true;

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private notifier: NotifierService) {
    let before: string = '';
    router.events.subscribe((event) => {
      // see also
      if ((event.url === '/map' && (before == '/login' || before == '')) || (before === '/profile' && event.url === '/profile')) {
        this.checkUser();
      }
      if (event instanceof NavigationEnd) {
        before = event.url;
      }
    });
    notifier.pageChanged$.subscribe(action => {
      console.log("Action: " + action);
      switch (action){
        case 0:
          this.menuButton = true;
          break;
        case 1:
          this.menuButton = false;
          break;
        case 2:
          this.checkUser();
          break;
      }
    });
  }

  ngOnInit() {
    this.checkUser();
  }

  checkUser() {
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
        error => console.log(error));
    } else {
      this.image = this.getPictureUrl('');
    }
  }

  getPictureUrl(src: string) {

    if (!this.login) {
      return './assets/profile_picture.png';
    } else if (src == null || src.length == 0 || src === 'null') {
      return './assets/profile_picture.png';
    }
    return this.user.picture;
  }

  onClickMenu() {
    if(this.menuButton) {
      this.visibleMenu = !this.visibleMenu;
    } else {
      this.notifier.notify(10);
      this.menuButton = true;
    }
  }

  logOut() {
    this.visibleMenu = !this.visibleMenu;
    this.image = this.getPictureUrl('');
    this.userService.logout().subscribe(
      message => {
        this.login = false;
        this.user = new User(null, '', '', '', '', '', 0, 0, '');
        this.router.navigate(['/map']);
        this.tokenService.clearToken()
      },
      error => {
        // this.tokenService.clearToken();
        console.log("Error:" + error)
      }
    );

  }
}
