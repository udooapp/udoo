import {Component} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {NotifierController} from "../controllers/notify.controller";
import {MAP} from "./app.routing.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  visibleMenu: boolean = false;
  menuButton: boolean = true;
  errorMessage: string = '';
  error: boolean = false;
  activated: boolean = true;

  constructor(private notifier: NotifierController) {
    MAP;
    document['locale'] = 'en';
    notifier.pageChanged$.subscribe(action => {
      if (action === ' ') {
        this.menuButton = true;
      } else if (action.endsWith('New')) {
        this.menuButton = false;
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
        this.menuButton = true;
      }
    } else {
      this.visibleMenu = !this.visibleMenu;
      this.menuButton = !this.menuButton;
    }
  }
  public menuItemClicked(){
    this.visibleMenu = !this.visibleMenu;
    this.menuButton = !this.menuButton;
  }

  public onScroll(){
    let e: HTMLElement = document.getElementById("content-container");
    if (e.scrollHeight - e.scrollTop <= document.body.offsetHeight) {
        this.notifier.userScrolledToTheBottom$.emit(true);
    }
  }
}
