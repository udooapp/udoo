import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {TokenService} from "./token.service";
import {HeaderService} from "./header.service";

@Injectable()
export class EmailService extends HeaderService {

  constructor(private http: Http, private tokenService: TokenService) {
    super();
  }

  public sendReminder(email: string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder', JSON.stringify({email: email}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendVerificationEmail(): Observable<string> {

    return this.http.get(config.server + '/mail/user/verification/email', new RequestOptions({headers:  this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendVerificationSms(): Observable<string> {
    return this.http.get(config.server + '/mail/user/verification/sms', new RequestOptions({headers:  this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }
  public checkVerification(token: string): Observable<string> {
    return this.http.post(config.server + '/mail/verification/valid', JSON.stringify({token: token}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleErrorText);
  }

  public sendKey(key: string): Observable<string> {
    return this.http.post(config.server + '/mail/user/verification/valid', JSON.stringify({
      key: key
    }), new RequestOptions({headers: this.getTokenHeaders(this.tokenService.getToken())}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
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
