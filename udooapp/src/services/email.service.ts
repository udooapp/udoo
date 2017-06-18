import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {HandlerService} from "./handler.service";
import {config} from "../environments/url.config";
import {TokenService} from "./token.service";

@Injectable()
export class EmailService {
  private headers: Headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', `${config.client}`);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }

  public sendReminder(email: string): Observable<string> {
    return this.http.post(config.server + '/mail/reminder', JSON.stringify({email: email}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendVerificationEmail(): Observable<string> {
    let headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin', config.client);
    headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + this.tokenService.getToken());
    return this.http.get(config.server + '/mail/user/verification/email', new RequestOptions({headers: headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  public sendVerificationSms(): Observable<string> {
    let headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin', config.client);
    headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + this.tokenService.getToken());
    return this.http.get(config.server + '/mail/user/verification/sms', new RequestOptions({headers: headers}))
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

  public sendKey(key: string): Observable<string> {
    this.refreshHeaderToken();
    return this.http.post(config.server + '/mail/user/verification/valid', JSON.stringify({
      key: key
    }), new RequestOptions({headers: this.headers}))
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

  private refreshHeaderToken(): void {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
  }
}
