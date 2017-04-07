import {Injectable}              from '@angular/core';
import {Http, Response, Headers, RequestOptions}          from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {User} from '../user/user';

@Injectable()
export class RegistrationService {
  private userUrl: string = 'http://localhost:8090/rest/user';  // URL to web API
  private body = '{\"name\" : \"John Smith\",\"password\" : \"password1\",\"email\": \"john.smith@email.com\",\"phone\": \"0123456789\",\"picture\": \"\"}';
  public response: string;

  constructor(private http: Http) {
  }

  getUser(): Observable<User[]> {
    return this.http.get(this.userUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postUser(user: User) {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    headers.append("Access-Control-Allow-Methods", "GET, PUT, POST");
    let options = new RequestOptions({headers: headers});
    this.http.post(this.userUrl, user.toString(), options).map(this.extractData).catch(this.handleError)
      .subscribe(
        response => this.handleError, this.extractData,
        () => console.log('Authentication Complete')
      );
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body)
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
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}
