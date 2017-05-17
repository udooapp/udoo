import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
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
  private headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }

  logout(): void {
    this.tokenService.clearToken();
    this.http.post(config.server + '/logout', this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
  }

  loginUser(user: User): Observable<string> {
    return this.http.post(config.server + '/login', user.toString(), new RequestOptions({headers: this.headers}))
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          this.tokenService.saveToken(token, user.email);
          // return true to indicate successful login
          return '';
        } else {
          return HandlerService.handleText(response);
      }
      }).catch((response: Response) => { return HandlerService.handleText(response)});
  }

  updateUser(user: User): Observable<String> {
    return this.http.post(config.server + '/update',
      '{"uid" : "' + user.uid + '",' +
      '"name" : "' + user.name + '",' +
      '"email" : "' + user.email + '",' +
      '"password" : "' + user.password + '",' +
      '"phone" : "' + user.phone + '",' +
      '"type" : "' + user.type + '",' +
      '"stars" : "' + user.stars + '",' +
      '"birthdate" : "' + user.birthdate + '",' +
      '"picture" : "' + user.picture + '"}'
      , new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }


  getUserCurrentUser(): Observable<User> {
    return this.http.get(config.server + '/user/' + JSON.parse(this.tokenService.getToken()).username)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  getUserData(token: any): Observable<User> {
    return this.http.post(config.server + '/userdata', token.toString(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  getUserInfo(uid: any): Observable<User> {
    return this.http.get(config.server + '/userinfo/' +uid)
      .map(HandlerService.extractData)
      .catch(HandlerService.handleError);
  }

  registrateUser(user: User): Observable<String> {
    return this.http.post(config.server + '/registration', user.toString(), new RequestOptions({headers: this.headers}))
      .map(HandlerService.extractText)
      .catch(HandlerService.handleText);
  }

  changePassword(cpass: string, npass: string): Observable<String> {
    return this.http.post(config.server + '/password?cpass=' + cpass + '&npass=' + npass + "&email=" + JSON.parse(this.tokenService.getToken()).username, new RequestOptions({headers: this.headers}))
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
