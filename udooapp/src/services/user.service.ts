import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {User} from '../entity/user';
import {TokenService} from "../guard/TokenService";

@Injectable()
export class UserService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http, private tokenService: TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  }
  logout() : void{
    this.tokenService.clearToken();
    this.http.post(this.userUrl + '/logout', this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
  }
  loginUser(user: User): Observable<boolean> {
    return this.http.post(this.userUrl + '/login', user.toString(), new RequestOptions({headers: this.headers}))
      .map((response: Response)=>{
        let token = response.json() && response.json().token;
        if (token) {
          this.tokenService.saveToken(token, user.email);
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
    });
  }

  updateUser(user: User): Observable<String> {
    return this.http.post(this.userUrl + '/update',
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
      .map(this.extractText)
      .catch(this.handleText);
  }


  getUser(id: number): Observable<User> {
    return this.http.get(this.userUrl + '/user/' + id)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getUserData(token: any): Observable<User> {
    return this.http.post(this.userUrl + '/userdata', token.toString(), new RequestOptions({headers : this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  registrateUser(user: User): Observable<String> {
    return this.http.post(this.userUrl + '/registration', user.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractText)
      .catch(this.handleText);
  }

  changePassword(cpass: string, npass: string, id: number): Observable<String> {
    return this.http.post(this.userUrl + '/password?cpass=' + cpass + '&npass=' + npass + "&id=" + id, new RequestOptions({headers: this.headers}))
      .map(this.extractText)
      .catch(this.handleText);
  }

  uploadPicture(file: File): Observable<String> {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.userUrl + '/upload', formData)
      .map(this.extractText)
      .catch(this.handleText)
  }

  private extractText(res: Response) {
    return res.text();
  }

  private handleText(error: Response | any) {
    return Observable.throw(error.message ? error.message : error.toString());
  }

  private extractData(res: Response) {
    return JSON.parse(res.text()) || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
