import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Request} from '../entity/request'
import {TokenService} from "../guard/TokenService";
@Injectable()
export class RequestService {
  private userUrl = 'http://localhost:8090/rest';  // URL to web API
  private headers;

  constructor(private http: Http, private tokenService : TokenService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET');
  }

  saveRequest(request: Request): Observable<String> {
    return this.http.post(this.userUrl + '/saverequest/' + JSON.parse(this.tokenService.getToken()).username, request.toString(), new RequestOptions({headers: this.headers}))
      .map(this.extractText)
      .catch(this.handleError);
  }

  getUserRequest(): Observable<Request[]> {
    return this.http.post(this.userUrl + '/request' , this.tokenService.getToken(), new RequestOptions({headers: this.headers}))
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res.json() || {};
  }
  private extractText(res: Response) {
    return res.text() || {};
  }

  private handleError(error: Response) {
    console.log(error.toString(), error.text());

    return Observable.throw(error.text());
  }
}
