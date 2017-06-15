import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../entity/user";
import {TokenService} from "../services/token.service";
import {NotifierService} from "../services/notify.service";
import {CREATE, LOGIN, MAP} from "../app/app.routing.module";
import {EmailService} from "../services/email.service";
import {document} from "@angular/platform-browser/src/facade/browser";
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
  visibleMenu: boolean = false;
  stars: number[] = [0, 0, 0, 0, 0];
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en');
  login: boolean = false;
  image: string;
  checkLogin: boolean = false;

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private notifier: NotifierService, private emailService: EmailService) {
    let before: string = '';
    notifier.pageChanged$.subscribe(action => {
      if (action === 'refresh') {
        this.checkUser();
      }
    });
    router.events.subscribe((event) => {
      if (event.url === MAP && (before === LOGIN || before === '')) {
        this.checkLogin = event.url === MAP && before === LOGIN;
        this.checkUser();
      } else {
        this.checkLogin = false;
      }
      if (event instanceof NavigationEnd) {
        before = event.url;
      }
    });
    notifier.errorMessage$.subscribe(message => {
      if (message === 'Invalid token') {
        this.tokenService.clearToken();
        this.router.navigate([LOGIN]);
        this.user = new User(null, '', '', '', '', '', 0, 0, '', 'en');
        this.login = false;
      }
    });
    notifier.userModification$.subscribe(verify => {
      if (verify == -1) {
        if (this.tokenService.getToken() != null && this.tokenService.getToken().length > 0) {
          this.emailService.sendVerification(this.user.email).subscribe(
            message => this.notifier.sendMessage(message),
            error => console.log(error)
          )
        } else if(verify == 0 || verify == 1){
            this.user.language = verify == 0 ? 'en' : 'de';
            document['locale']= this.user.language;
            this.userService.updateUser(this.user).subscribe(
              message=>{},
              error=>{
                if (error === 'Invalid token') {
                  this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language);
                  this.login = false;
                  this.image = this.getPictureUrl('');
                }
                this.notifier.notifyError(error);
              }
            );
        }
      }
    });
  }

  @Input() set showMenu(show: boolean) {
    this.visibleMenu = show;
  }

  ngOnInit() {
    this.checkUser();
  }

  public checkUser() {
    let token = this.tokenService.getToken();
    if (token != null && token.length > 0) {
      this.login = true;
      this.userService.getUserData().subscribe(
        data => {
          this.user = data.user;
          document['locale']= this.user.language;
          this.image = this.getPictureUrl(data.user.picture);
          let star = data.user.stars;
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
          this.activated = data.verification === 0;
          this.activatedUser.emit(this.activated);
          if (!this.activated && this.checkLogin) {
            this.router.navigate([CREATE]);
          }
        },
        error => {
          console.log(error);
          if (error === 'Invalid token') {
            this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language);
            this.login = false;
            this.image = this.getPictureUrl('');
          }
          this.notifier.notifyError(error);
        });
    } else {
      this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language);
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
    this.visibleMenu = false;
    this.menuItemClicked.emit(false);
  }

  public logOut() {
    this.visibleMenu = !this.visibleMenu;
    this.menuItemClicked.emit(this.visibleMenu);
    this.image = this.getPictureUrl('');
    this.userService.logout().subscribe(
      message => {
        this.login = false;
        this.user = new User(null, '', '', '', '', '', 0, 0, '', this.user.language);
        this.router.navigate([MAP]);
        this.tokenService.clearToken()
      },
      error => {
        console.log("Error:" + error);
      }
    );
  }
}
