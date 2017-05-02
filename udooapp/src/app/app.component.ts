import {Component, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../entity/user";
import {TokenService} from "../guard/TokenService";
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

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService) {
    router.events.subscribe((val) => {
      // see also
      if (val.url === '/map') {
        this.checkUser();
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
    }
  }

  logOut() {
    this.visibleMenu = !this.visibleMenu;
    this.userService.logout();
    this.login = false;
    this.user = new User(null, '', '', '', '', '', 0, 0, '');
    this.router.navigate(['/map']);
  }
}
