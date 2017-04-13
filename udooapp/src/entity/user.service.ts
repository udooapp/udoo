import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {User} from './user';

@Injectable()
export class UserService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST');
  }

  loginUser(user: User): Observable<String> {

    return this.http.post(this.userUrl + '/login', user.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateUser(user: User): Observable<String> {

    return this.http.post(this.userUrl + '/update', user.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  registrateUser(user: User): Observable<String> {

    return this.http.post(this.userUrl + '/registration', user.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  changePassword(cpass : string, npass : string, id : number): Observable<String> {
    return this.http.post(this.userUrl + '/password?cpass=' + cpass + '&npass=' + npass + "&id=" + id, new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body.data || {};
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
