import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {User} from '../entity/user';
import {TokenService} from "../guard/TokenService";
import {HandlerService} from "./handler.service";
import {config} from "../config/url.config";

@Injectable()
export class UserService {
  private headers: Headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', `${config.client}`);
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }

  logout(): Observable<String> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }

    let param: URLSearchParams = new URLSearchParams();
    param.append("param", "param");
    return this.http.get(config.server + '/user/logout', new RequestOptions({headers: this.headers, search: param}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  loginUser(user: User): Observable<string> {

    return this.http.post(config.server + '/login', user.toString(), new RequestOptions({headers: this.headers}))
      .map((response: Response) => {
        let token = response.text();
        if (token) {
          this.tokenService.saveToken(token);
          // return true to indicate successful login
          return '';
        } else {
          return HandlerService.handleText(response);
        }
      }).catch((response: Response) => {
        return HandlerService.handleText(response)
      });
  }

  updateUser(user: User): Observable<String> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
    return this.http.post(config.server + '/user/update',
      JSON.stringify(user)
      , new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  getUserData(): Observable<User> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
    return this.http.get(config.server + '/user/userdata', new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  getUserInfo(uid: any): Observable<User> {
    return this.http.get(config.server + '/userinfo/' + uid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  registrateUser(user: User): Observable<String> {
    return this.http.post(config.server + '/registration', user.toString(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  changePassword(cpass: string, npass: string): Observable<String> {
    if (!this.headers.has(HandlerService.AUTHORIZATION)) {
      this.headers.append(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    } else {
      this.headers.set(HandlerService.AUTHORIZATION, 'Bearer ' + `${this.tokenService.getToken()}`);
    }
    return this.http.post(config.server + '/user/password', JSON.stringify({
      cpass: cpass,
      npass: npass,
    }), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  uploadPicture(file: File): Observable<String> {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(config.server + '/upload', formData)
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText)
  }


}
