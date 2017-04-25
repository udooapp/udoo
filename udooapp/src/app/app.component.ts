import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent {
  visibleMenu = false;
  constructor(private router: Router, private userService : UserService){}

  logOut(){
    this.visibleMenu = !this.visibleMenu;
    this.userService.logout();
    this.router.navigate(['/map']);
  }
}
