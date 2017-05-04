import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../entity/user";
import {TokenService} from "../guard/TokenService";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
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
  image : SafeUrl;
  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private sanitizer: DomSanitizer) {
    let before : string = '';
    router.events.subscribe((event) => {
      // see also
      if ((event.url === '/map' && (before == '/login' || before == '')) || (before === '/profile'&& event.url === '/profile')) {
        this.checkUser();
      }
      if(event instanceof NavigationEnd) {
        before = event.url;
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
      this.userService.getUserData(token).subscribe(
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

  getPictureUrl(src : string) {

    if (!this.login) {
      return '/src/images/profile_picture.png';
    } else if(src == null || src.length == 0 || src === 'null'){
      return '/src/images/profile_picture.png';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + this.user.picture);
  }

  logOut() {
    this.visibleMenu = !this.visibleMenu;
    this.image = this.getPictureUrl('');
    this.userService.logout();
    this.login = false;
    this.user = new User(null, '', '', '', '', '', 0, 0, '');
    this.router.navigate(['/map']);
  }
}
