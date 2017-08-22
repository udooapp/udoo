import {Component} from '@angular/core';


import {UserService} from "../../services/user.service";
import {NotifierController} from "../../controllers/notify.controller";
import {Router} from "@angular/router";
import {UserController} from "../../controllers/user.controller";
import {ROUTES} from "../../app/app.routing";

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [UserService,]
})
export class SettingsComponent {
  private static NAME: string = 'Settings';
  message: String;
  error = '';
  public languages: string[] = ['English', 'German'];
  constructor(private userController: UserController, private notifier: NotifierController, private router: Router) {
    notifier.notify(SettingsComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == SettingsComponent.NAME) {
        router.navigate([ROUTES.MAIN]);
      }
    })
  }
  onChangeTypeSelect(event){
    this.userController.sendUserModification(event);
  }
}
