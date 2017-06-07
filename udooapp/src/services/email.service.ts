import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";

@Injectable()
export class EmailService {

  constructor(private http: Http) {
  }

  public sendReminder(email: string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder', JSON.stringify({email: email}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendVerification(email: string): Observable<string> {
    return this.http.post(config.server + '/mail/verification', JSON.stringify({email: email}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public checkVerification(token: string): Observable<string> {
    return this.http.post(config.server + '/mail/verification/valid', JSON.stringify({token: token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleErrorText);
  }

  public checkUserVerification(token: string): Observable<string> {
    let headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin', config.client);
    headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + token);
    return this.http.get(config.server + '/mail/user/verification', new RequestOptions({headers: headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleErrorText);
  }

  public sendNewPassword(password: string, token: string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder/password', JSON.stringify({password: password, token: token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public checkToken(token: string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder/valid', JSON.stringify({token: token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
}
