import {Component} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {NotifierController} from "../controllers/notify.controller";
import {MAIN} from "./app.routing.module";
import {TokenService} from "../services/token.service";
import {SearchController} from "../controllers/search.controller";
import {DialogController} from "../controllers/dialog.controller";
import {UserController} from "../controllers/user.controller";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  visibleMenu: boolean = false;
  menuButton: boolean = true;
  searchButton: boolean = false;
  errorMessage: string = '';
  error: boolean = false;
  activated: boolean = true;
  public searchVisibility: boolean = false;
  private clickedPage: boolean = false;
  public notificationCounter: number = 0;
  public systemNotification: any[] = [];
  public contentContainerHeight: number = 0;

  constructor(private userController: UserController, private dialog: DialogController, private notifier: NotifierController, private tokenService: TokenService, private searchController: SearchController) {
    MAIN;
    tokenService.clearSearchData();
    document['locale'] = 'en';
    notifier.pageChanged$.subscribe(action => {
      if (action === ' ') {
        this.menuButton = true;
      } else if (action.endsWith('New')) {
        this.menuButton = false;
        this.clickedPage = true;
      }
    });
    searchController.onChangeSearchButtonVisibility$.subscribe(value => {
      this.searchButton = value;
    });
    this.userController.userNotification$.subscribe(value => {
      this.notificationCounter = value;
    });
    notifier.systemNotification$.subscribe(value => {

      this.systemNotification = value;
      this.contentContainerHeight = window.innerHeight - 60 - (48.5 * this.systemNotification.length);
    });
    this.contentContainerHeight = window.innerHeight - 60 - (48.5 * this.systemNotification.length);
    let t = this;
    window.addEventListener('resize', function (e) {
      t.contentContainerHeight = window.innerHeight - 60 - (48.5 * t.systemNotification.length);
    });
    window.addEventListener('orientationchange', function (e) {
      t.contentContainerHeight = window.innerHeight - 60 - (48.5 * t.systemNotification.length);
    });
    this.dialog.closableResponse$.subscribe(response => {
      if (!response.value && response.index > -1) {
        this.systemNotification.splice(response.index, 1);
        this.contentContainerHeight = window.innerHeight - 60 - (48.5 * this.systemNotification.length);
      }
    });
  }


  public onClickSearchButton() {
    this.searchVisibility = true;
    this.searchController.onClickSearchButton$.emit(true);
  }

  public onClickSearchClose() {
    this.searchVisibility = false;
  }

  public onKeySearch(event) {
    if (event.which == 13) {
      this.searchVisibility = !this.searchVisibility;
    }
  }

  public changeButton() {
    if (!this.menuButton && !this.visibleMenu) {
      this.menuButton = true;
    }
    this.notifier.clear();
  }

  public onClickMenu() {
    if (!this.menuButton && !this.visibleMenu) {
      this.notifier.back();
      if (this.notifier.isEmpty()) {
        this.clickedPage = false;
        this.menuButton = true;
      }
    } else {
      this.visibleMenu = !this.visibleMenu;
      if (!this.clickedPage) {
        this.menuButton = !this.menuButton;
      }
    }
  }

  public menuItemClicked(event) {
    if (event) {
      this.visibleMenu = false;
      this.clickedPage = false;
      this.notifier.clear();
      this.menuButton = true;
    } else {
      this.visibleMenu = !this.visibleMenu;
      if (!this.clickedPage) {
        this.menuButton = !this.menuButton;
      }
    }
  }

  public onScroll() {
    let e: HTMLElement = document.getElementById("content-container");
    if (e.scrollHeight - e.scrollTop <= document.body.offsetHeight) {
      this.notifier.userScrolledToTheBottom$.emit(true);
    }
  }

  public onClickMore(index: number) {
    if (this.systemNotification != null && this.systemNotification[index].length > 0) {
      this.dialog.sendClosable({index: index, content: this.systemNotification[index]});
    }
  }
}
