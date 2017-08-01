import {Component} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {NotifierController} from "../controllers/notify.controller";
import {MAP} from "./app.routing.module";
import {TokenService} from "../services/token.service";

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
  private clickedPage: boolean = false;

  constructor(private notifier: NotifierController, private tokenService: TokenService) {
    MAP;
    tokenService.clearSearchData();
    document['locale'] = 'en';
    notifier.pageChanged$.subscribe(action => {
      if (action === ' ') {
        this.menuButton = true;
      } else if (action.endsWith('New')) {
        this.menuButton = false;
        this.clickedPage =  true;
      }

    });

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
      if(!this.clickedPage) {
        this.menuButton = !this.menuButton;
      }
    }
  }
  public menuItemClicked(event){
    if(event){
      this.visibleMenu = false;
      this.clickedPage = false;
      this.notifier.clear();
      this.menuButton = true;
    } else {
      this.visibleMenu = !this.visibleMenu;
      if(!this.clickedPage) {
        this.menuButton = !this.menuButton;
      }
    }
  }

  public onScroll(){
    let e: HTMLElement = document.getElementById("content-container");
    if (e.scrollHeight - e.scrollTop <= document.body.offsetHeight) {
        this.notifier.userScrolledToTheBottom$.emit(true);
    }
  }
}
