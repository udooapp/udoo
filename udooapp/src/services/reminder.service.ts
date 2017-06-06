import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";

@Injectable()
export class ReminderService {

  constructor(private http: Http) {
  }

  public sendReminder(email : string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder', JSON.stringify({email:email}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendNewPassword(password : string, token: string): Observable<string> {
    return this.http.post(config.server + '/mail/password', JSON.stringify({password:password, token: token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  public checkToken(token : string): Observable<string> {
    return this.http.post(config.server + '/mail/valid', JSON.stringify({token:token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
}
