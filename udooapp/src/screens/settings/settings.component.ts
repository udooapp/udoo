import {Component} from '@angular/core';


import {UserService} from "../../services/user.service";
import {NotifierService} from "../../services/notify.service";
import {Router} from "@angular/router";
import {MAP} from "../../app/app.routing.module";

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
  constructor(private notifier: NotifierService, private router: Router) {
    notifier.notify(SettingsComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == SettingsComponent.NAME) {
        router.navigate([MAP]);
      }
    })
  }
  onChangeTypeSelect(event){
    this.notifier.sendUserModification(event);
  }
}
