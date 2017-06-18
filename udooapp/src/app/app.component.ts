import {Component, Inject, LOCALE_ID} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {NotifierService} from "../services/notify.service";
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
  message: string = '';
  error: boolean = false;
  mainError: boolean = false;
  activated: boolean = true;

  constructor(private notifier: NotifierService ) {
    MAP;
    document['locale'] = 'en';
    notifier.pageChanged$.subscribe(action => {
      if (action === ' ') {
        this.menuButton = true;
      } else if (action.endsWith('New')) {
        this.menuButton = false;
      }

    });
    notifier.notificationMessage$.subscribe(message => {
      this.message = message;
    });
    notifier.errorMessage$.subscribe(message => {
      if(message === 'Invalid token') {
        this.message = 'Your token expired';
      }else{
        this.errorMessage = message;
        this.error = true;
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
  public menuItemClicked($event){
    this.visibleMenu = false;
    this.menuButton = true;
  }
  public onClickDialogButton() {
    if (this.message.length > 0) {
      this.message = ''
    } else {
      this.error = false;
      this.notifier.tryAgain();
      if (this.mainError) {
        this.mainError = false;
        this.notifier.refreshMainData();
      }
    }
  }

  public sendNewVerification() {
    this.notifier.sendVerification();
  }
}
